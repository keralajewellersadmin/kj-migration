const KEY = "c4a9f3b2-81d7-4a2e-9c1d-8e6f5a4b3c2d";
const start = Date.now();
(async () => {
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 15000));
    const t = ((Date.now()-start)/1000).toFixed(0);
    try {
      const r = await fetch(`https://kj-migration.vercel.app/api/auth/simple-diag?k=${KEY}`, { signal: AbortSignal.timeout(30000) });
      const txt = await r.text();
      if (r.status === 200 && txt.includes("hasCookie")) {
        console.log(`READY at ${t}s`);
        require("fs").writeFileSync("C:\\Users\\mdsar\\AppData\\Local\\Temp\\opencode\\simple-diag.json", txt);
        console.log(JSON.stringify(JSON.parse(txt), null, 1));
        process.exit(0);
      }
      console.log(`[${t}s] status ${r.status}`, txt.slice(0, 120));
    } catch (e) { console.log(`[${t}s]`, e.message); }
  }
  console.log("NOT READY");
})();
