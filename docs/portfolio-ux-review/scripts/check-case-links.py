"""Read-only public case-route identity checks; no API requests."""
import html, json, re, urllib.request
from pathlib import Path

base='https://duytruyenthong.github.io/Alinguyen-portfolio/'
rows=[]
for slug in ['growth-commerce-os','stos','cho-kenh','vibecode-kit','kkbox-baseline']:
    url=base+'work/'+slug+'/'
    try:
        with urllib.request.urlopen(url,timeout=25) as response:
            text=response.read().decode()
            h1=re.search(r'<h1[^>]*>(.*?)</h1>',text,re.S)
            rows.append({'slug':slug,'url':url,'finalUrl':response.url,'status':response.status,'mime':response.headers.get_content_type(),'heading':html.unescape(re.sub('<[^>]+>','',h1.group(1))) if h1 else None})
    except Exception as exc:
        rows.append({'slug':slug,'url':url,'state':'Blocked or server failure needs classification','error':str(exc)})
dest=Path(__file__).resolve().parents[1]/'evidence/case-link-checks.json'
dest.write_text(json.dumps(rows,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(rows,indent=2,ensure_ascii=False))
