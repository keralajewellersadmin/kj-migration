import { spawnSync } from "node:child_process";

// Runs `payload migrate` before the build. A real migration error must fail
// the build; a DB that is simply unreachable (Neon quota 402, auth rotation,
// network timeouts) must NOT block deploys — ISR revalidates content once the
// DB is back.
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
    "\n[build] payload migrate skipped: database unreachable (quota/network). " +
      "Continuing build; content revalidates once the DB is back.",
  );
  process.exit(0);
}

console.error(
  `\n[build] payload migrate failed (exit ${result.status ?? "signal:" + result.signal}) — failing the build.`,
);
process.exit(result.status ?? 1);
