// Each attempt includes response-body reading. Retry only transient failures;
// validation, rate limits and malformed successful replies must not be retried.
export class GuideRequestError extends Error {
  status: number;
  constructor(status: number) { super('Guide unavailable'); this.status=status; }
}
export async function requestGuide<T>(endpoint: string, body: unknown, parse: (value: unknown) => T, fetcher: typeof fetch = fetch, timeoutMs = 16000) {
  for (let attempt=0; attempt<2; attempt++) {
    const controller=new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let retryable=true;
    try {
      const data=await Promise.race([
        (async()=>{
          const response=await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});
          if(!response.ok){retryable=[502,503,504].includes(response.status);throw new GuideRequestError(response.status);}
          const json=await response.json();
          retryable=false;
          return parse(json);
        })(),
        new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('Guide request timed out'));},timeoutMs);}),
      ]);
      return data;
    } catch(error) {
      if(error instanceof SyntaxError) retryable=false;
      if(!retryable||attempt===1) throw error;
    } finally { clearTimeout(timer); }
  }
  throw Error('Guide unavailable');
}
