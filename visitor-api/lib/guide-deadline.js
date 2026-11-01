export async function withDeadline(operation, milliseconds, controller = new AbortController()) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(() => operation(controller.signal)),
      new Promise((_, reject) => { timer=setTimeout(()=>{
        controller.abort(); reject(new Error('Guide dependency deadline exceeded'));
      },milliseconds); }),
    ]);
  } finally { clearTimeout(timer); }
}
