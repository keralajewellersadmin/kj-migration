const KEY = "c4a9f3b2-81d7-4a2e-9c1d-8e6f5a4b3c2d";
const start = Date.now();
(async () => {
  let res = null;
  for (let i = 0; i < 14; i++) {
    await new Promise((r) => setTimeout(r, 20000));
    try {
      const r = await fetch(`https://kj-migration.vercel.app/api/auth/_diag?k=${KEY}`, { signal: AbortSignal.timeout(30000) });
      const t = await r.text();
      if (r.status === 200) { res = t; console.log(`deployed+ready at ${((Date.now()-start)/1000).toFixed(0)}s`); break; }
      console.log(`[${((Date.now()-start)/1000).toFixed(0)}s] status`, r.status, t.slice(0, 60));
    } catch (e) { console.log(`[${((Date.now()-start)/1000).toFixed(0)}s]`, e.message); }
  }
  if (res) {
    const j = JSON.parse(res);
    console.log(JSON.stringify(j, null, 1));
  } else {
    console.log("DIAG NOT READY");
  }
})();
