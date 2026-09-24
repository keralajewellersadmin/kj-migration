import { spawnSync } from "node:child_process";

// Run Payload migrations before build. Real migration failures fail the build;
// an unreachable database (network/timeout) should not block deploys.
const result = spawnSync("npm", ["run", "payload:migrate"], {
  shell: true,
  encoding: "utf8",
  timeout: 120_000,
  env: process.env,
});

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
process.stdout.write(output);

if (result.status === 0) process.exit(0);

const unreachable = [
  /HTTP status 402/,
  /exceeded the quota/i,
  /password authentication failed/i,
  /HTTP status 401/,
  /HTTP status 5\d\d/,
  /ConnectTimeoutError/i,
  /connect timeout/i,
  /fetch failed/i,
  /ETIMEDOUT/,
  /ECONNREFUSED/,
  /ECONNRESET/,
  /ENOTFOUND/,
  /EPIPE/,
  /socket hang up/i,
  /ERR_UNHANDLED_REJECTION/,
];

if (unreachable.some((re) => re.test(output))) {
  console.warn(
    "\n[build] payload migrate skipped: database unreachable. Continuing build.",
  );
  process.exit(0);
}

console.error(
  `\n[build] payload migrate failed (exit ${result.status ?? "signal:" + result.signal}) — failing the build.`,
);
process.exit(result.status ?? 1);
