#!/usr/bin/env bun

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: bun youtube-transcribe.ts [--mode=chat|research|canvas] [--model=fast|thinking|pro] <youtube-url>");
  process.exit(1);
}

const watchScript = new URL("../../watch/scripts/transcribe.ts", import.meta.url).pathname;
const proc = Bun.spawn(["bun", watchScript, ...args], { stdout: "pipe", stderr: "pipe" });
const [stdout, stderr, code] = await Promise.all([
  new Response(proc.stdout).text(),
  new Response(proc.stderr).text(),
  proc.exited,
]);

if (stdout.trim()) console.log(stdout.trim());
if (code !== 0) {
  if (stderr.trim()) console.error(stderr.trim());
  process.exit(code);
}
