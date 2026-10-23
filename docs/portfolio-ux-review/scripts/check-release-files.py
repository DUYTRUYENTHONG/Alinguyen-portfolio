"""Read-only public release and CV identity checks; never calls analytics APIs."""
import hashlib, io, json, re, urllib.request, zipfile
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
DEST = ROOT / 'docs/portfolio-ux-review/evidence'
DEST.mkdir(parents=True, exist_ok=True)
BASE = 'https://duytruyenthong.github.io/Alinguyen-portfolio/'
def get(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as res:
            return {'url':url,'finalUrl':res.url,'status':res.status,'mime':res.headers.get_content_type(),'disposition':res.headers.get('Content-Disposition')}, res.read()
    except Exception as exc:
        return {'url':url,'error':str(exc)}, b''
def sha(data): return hashlib.sha256(data).hexdigest()

pages=[]
for url in [BASE+'?release=6244bcd#cvs',BASE]:
    meta, body=get(url)
    html=body.decode('utf-8',errors='replace')
    meta.update(sha256=sha(body),bytes=len(body),scripts=re.findall(r'<script[^>]+src="([^"]+)',html),styles=re.findall(r'<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)',html))
    pages.append(meta)
local=(ROOT/'out/index.html').read_bytes()
local_html=local.decode()
assets=[]
for source in pages[0].get('scripts',[])+pages[0].get('styles',[]):
    if not source.startswith('/Alinguyen-portfolio/_next/'): continue
    meta, body=get('https://duytruyenthong.github.io'+source)
    file=ROOT/'out'/source.removeprefix('/Alinguyen-portfolio/').split('?')[0]
    meta.update(bytes=len(body),sha256=sha(body),localExists=file.exists(),localMatch=file.exists() and sha(file.read_bytes())==sha(body))
    assets.append(meta)
release={'query':pages[0],'plain':pages[1],'sameServedHtml':pages[0].get('sha256')==pages[1].get('sha256'),'localHtmlSha256':sha(local),'exactHtmlMatch':pages[0].get('sha256')==sha(local),'localScripts':re.findall(r'<script[^>]+src="([^"]+)',local_html),'assets':assets}
(DEST/'release-fingerprints.json').write_text(json.dumps(release,indent=2))

files=[]
for name in ['cv-applied-ai-engineer.pdf','cv-business-product.pdf','cv-business-development.pdf','cv-prompt-engineer.docx']:
    meta,body=get(BASE+name)
    meta.update(filename=name,bytes=len(body),signature=body[:8].hex(),sha256=sha(body),matchesRepository=sha(body)==sha((ROOT/'public'/name).read_bytes()))
    if body.startswith(b'%PDF-'):
        reader=PdfReader(io.BytesIO(body));text='\n'.join(p.extract_text() or '' for p in reader.pages)
        meta.update(pages=len(reader.pages),title=str(reader.metadata.title),identityExcerpt=text[:1800])
    elif body.startswith(b'PK'):
        with zipfile.ZipFile(io.BytesIO(body)) as z:
            xml=z.read('word/document.xml').decode();text=' '.join(re.findall(r'<w:t[^>]*>(.*?)</w:t>',xml))
            meta.update(wordDocumentPresent=True,identityExcerpt=text[:1800])
    files.append(meta)
(DEST/'cv-files.json').write_text(json.dumps(files,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'releaseSameHtml':release['sameServedHtml'],'exactHtmlMatch':release['exactHtmlMatch'],'matchedAssets':sum(a['localMatch'] for a in assets),'assets':len(assets),'files':[{k:v for k,v in f.items() if k!='identityExcerpt'} for f in files]},indent=2))
