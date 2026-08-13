const KEY = "c4a9f3b2-81d7-4a2e-9c1d-8e6f5a4b3c2d";
(async () => {
  for (let i = 0; i < 8; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    try {
      const r = await fetch(`https://kj-migration.vercel.app/api/auth/_diag?k=${KEY}`, { signal: AbortSignal.timeout(45000) });
      const t = await r.text();
      if (r.status === 200 && t.includes("tokenDiag")) { console.log("READY"); console.log(JSON.stringify(JSON.parse(t), null, 1)); process.exit(0); }
      if (r.status === 403) { console.log("403 forbidden (wrong key handling?)"); console.log(t.slice(0,200)); process.exit(0); }
      console.log(`[${i}] status ${r.status}`, t.slice(0, 90));
    } catch (e) { console.log(`[${i}]`, e.message); }
  }
  console.log("STILL NOT READY");
})();
