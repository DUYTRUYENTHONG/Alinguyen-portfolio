"""Offline embedding build; downloads pinned public model weights, no inference API."""
import hashlib, json, pathlib, urllib.request
import torch
from transformers import AutoTokenizer, AutoModel
ROOT=pathlib.Path(__file__).resolve().parents[2]
path=ROOT/'artifacts/retrieval/input.json'
raw=path.read_bytes(); data=json.loads(raw)
info=json.loads((ROOT/'visitor-api/evaluation/e5-model.json').read_text())
revision=info['revision']
assert len(revision)==40
name='intfloat/multilingual-e5-small'
tokenizer=AutoTokenizer.from_pretrained(name,revision=revision,trust_remote_code=False)
model=AutoModel.from_pretrained(name,revision=revision,trust_remote_code=False).eval()
torch.set_num_threads(4)
def encode(texts):
    batches=[]
    for start in range(0,len(texts),8):
        batch=tokenizer(texts[start:start+8],max_length=512,padding=True,truncation=True,return_tensors='pt')
        with torch.inference_mode(): hidden=model(**batch).last_hidden_state
        mask=batch['attention_mask'].unsqueeze(-1)
        pooled=(hidden*mask).sum(1)/mask.sum(1)
        batches.append(torch.nn.functional.normalize(pooled,p=2,dim=1))
    return torch.cat(batches)
queries=encode(['query: '+q['question'] for q in data['questions']])
baseline=encode(['passage: '+r['title']+'. '+r['text'] for r in data['corpus']])
enriched=encode(['passage: '+r['title']+'. '+r['text']+(' '+r['textVi'] if r['textVi'] else '') for r in data['corpus']])
def rank(matrix,i):
    scores=(queries[i]@matrix.T).tolist()
    return [data['corpus'][j]['id'] for j in sorted(range(len(scores)),key=lambda j:(-scores[j],data['corpus'][j]['id']))]
result={'inputSha256':hashlib.sha256(raw).hexdigest(),'model':{'name':name,'revision':revision,'pooling':'attention-mask mean; L2 normalized','similarity':'exact cosine, CPU float32','maxLength':512,'queryPrefix':'query: ','passagePrefix':'passage: ','torch':torch.__version__},'rows':[{'id':q['id'],'baseline':rank(baseline,i),'enriched':rank(enriched,i)} for i,q in enumerate(data['questions'])]}
(ROOT/'artifacts/retrieval/embedded.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'model':result['model'],'questions':len(result['rows']),'providerCalls':0}))
