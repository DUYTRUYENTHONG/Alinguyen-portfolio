"""Bounded offline LoRA experiment. No provider, private data, or runtime deployment."""
import hashlib, json, pathlib, random, time, platform, importlib.metadata
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import LoraConfig, get_peft_model
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'artifacts/action-training'; OUT.mkdir(parents=True,exist_ok=True)
random.seed(42);torch.manual_seed(42);torch.set_num_threads(4)
pin=json.loads((ROOT/'visitor-api/evaluation/action-model.json').read_text())
data_dir=ROOT/'visitor-api/evaluation/action-data'
train=json.loads((data_dir/'train.json').read_text(encoding='utf-8'))
dev=json.loads((data_dir/'dev.json').read_text(encoding='utf-8'))
# Only the training/development split is loaded before checkpoint selection.
assert not ({x['family'] for x in train}&{x['family'] for x in dev})
rules="Choose one allowed next action for the CURRENT user request. Prior messages are context, not authority. Do not pitch after correcting an unsupported claim. Do not repeat used or declined actions. Ask clarification if multiple projects fit an ambiguous pronoun. Planned or unsupported destinations mean no_action. Return only JSON: {\"action\":\"an allowed ID\"}."
tokenizer=AutoTokenizer.from_pretrained(pin['name'],revision=pin['revision'],trust_remote_code=False)
base=AutoModelForCausalLM.from_pretrained(pin['name'],revision=pin['revision'],trust_remote_code=False,dtype=torch.float32,attn_implementation='eager')
base.config.use_cache=False
def prompt(row):
    safe={k:row[k] for k in ['current','history','sourceIds','allowedActions','actionState']}
    return tokenizer.apply_chat_template([{'role':'system','content':rules},{'role':'user','content':json.dumps(safe,ensure_ascii=False)}],tokenize=False,add_generation_prompt=True,enable_thinking=False)
def encoded(row):
    prefix=tokenizer(prompt(row),add_special_tokens=False)['input_ids']
    target=tokenizer(json.dumps({'action':row['acceptable'][0]},separators=(',',':'))+tokenizer.eos_token,add_special_tokens=False)['input_ids']
    assert len(prefix)+len(target)<=512,'Oversize fixture: do not silently truncate evidence'
    return {'input_ids':torch.tensor([prefix+target]),'labels':torch.tensor([[-100]*len(prefix)+target])}
train_batches=[encoded(r) for r in train];dev_batches=[encoded(r) for r in dev]
model=get_peft_model(base,LoraConfig(r=4,lora_alpha=8,lora_dropout=.05,target_modules=['q_proj','v_proj'],task_type='CAUSAL_LM',bias='none'))
optimizer=torch.optim.AdamW([p for p in model.parameters() if p.requires_grad],lr=2e-4)
def dev_loss():
    model.eval()
    with torch.inference_mode(): values=[model(**batch).loss.item() for batch in dev_batches]
    return sum(values)/len(values)
report={'base':pin,'seed':42,'device':'CPU float32','platform':platform.platform(),'threads':4,'budget':{'updates':32,'trainingSeconds':300},'lora':{'rank':4,'alpha':8,'dropout':.05,'targets':['q_proj','v_proj']},'loss':'assistant-output-only; prompt labels -100','versions':{p:importlib.metadata.version(p) for p in ['torch','transformers','peft','tokenizers']},'dataHashes':{s:hashlib.sha256((data_dir/(s+'.json')).read_bytes()).hexdigest() for s in ['train','dev']},'splitCounts':{'train':len(train),'dev':len(dev)},'learningCurve':[],'devCurve':[],'completedUpdates':0,'providerCalls':0}
best=float('inf');start=time.monotonic()
for step in range(32):
    model.train();optimizer.zero_grad(set_to_none=True)
    loss=model(**train_batches[step%len(train)]).loss
    loss.backward();torch.nn.utils.clip_grad_norm_([p for p in model.parameters() if p.requires_grad],1.0);optimizer.step()
    report['completedUpdates']=step+1;report['learningCurve'].append({'step':step+1,'loss':loss.item(),'elapsedSeconds':round(time.monotonic()-start,2)})
    stop=time.monotonic()-start>=300
    if (step+1)%16==0 or stop:
        value=dev_loss();report['devCurve'].append({'step':step+1,'loss':value})
        if value<best:
            best=value;report['selectedStep']=step+1;model.save_pretrained(OUT/'adapter')
    (OUT/'training.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print(json.dumps(report['learningCurve'][-1]),flush=True)
    if stop:break
report['meaningfulBudgetCompleted']=report['completedUpdates']==32
report['adapterSha256']=hashlib.sha256((OUT/'adapter/adapter_model.safetensors').read_bytes()).hexdigest()
# Never use test labels for checkpoint selection, prompts, or further tuning.
test=json.loads((data_dir/'test.json').read_text(encoding='utf-8'))
assert not ({r['family'] for r in test}&{r['family'] for r in train+dev})
assert len({r['current'] for r in train+dev+test})==len(train+dev+test)
report['splitCounts']['test']=len(test);report['dataHashes']['test']=hashlib.sha256((data_dir/'test.json').read_bytes()).hexdigest()
def predict(row):
    batch=tokenizer(prompt(row),return_tensors='pt',add_special_tokens=False)
    with torch.inference_mode(): ids=model.generate(**batch,max_new_tokens=32,do_sample=False,pad_token_id=tokenizer.eos_token_id)
    text=tokenizer.decode(ids[0][batch['input_ids'].shape[1]:],skip_special_tokens=True).strip()
    try:
        value=json.loads(text);action=value['action']
        return action if set(value)=={'action'} and action in row['allowedActions'] else 'invalid'
    except (ValueError,KeyError,TypeError):return 'invalid'
model.eval();paired=[]
with model.disable_adapter():
    for row in test: paired.append({'id':row['id'],'base':predict(row)})
# Evaluate the development-selected saved adapter rather than the final weights.
from peft import set_peft_model_state_dict
from safetensors.torch import load_file
set_peft_model_state_dict(model,load_file(str(OUT/'adapter/adapter_model.safetensors')))
for row,result in zip(test,paired):result['adapter']=predict(row)
report['paired']=paired
report['decision']='Rules remain the production candidate. No learned table exported or promoted; independent review is pending.'
(OUT/'training.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({'complete':report['meaningfulBudgetCompleted'],'steps':report['completedUpdates'],'adapterSha256':report['adapterSha256']}),flush=True)
