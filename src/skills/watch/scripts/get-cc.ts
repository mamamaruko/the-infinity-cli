#!/usr/bin/env bun

import { $ } from "bun";
import { mkdtempSync, existsSync, readdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const url = process.argv[2];
const lang = process.argv[3] || "en";

if (!url) {
  console.error("Usage: bun get-cc.ts <youtube-url> [lang]");
  process.exit(1);
}

if (!Bun.which("yt-dlp")) {
  console.error("Missing required command: yt-dlp");
  console.error("Install with: brew install yt-dlp");
  process.exit(1);
}

const tempDir = mkdtempSync(join(tmpdir(), "watch-cc-"));

try {
  const videoId = (await $`yt-dlp --get-id ${url}`.text()).trim();

  await $`yt-dlp --write-auto-sub --sub-lang ${lang} --sub-format srt --skip-download -o ${tempDir}/%(id)s ${url}`.quiet();

  const expected = join(tempDir, `${videoId}.${lang}.srt`);
  if (existsSync(expected)) {
    console.log(await Bun.file(expected).text());
    process.exit(0);
  }

  const fallback = readdirSync(tempDir).find((file) => file.endsWith(".srt"));
  if (fallback) {
    console.log(await Bun.file(join(tempDir, fallback)).text());
    process.exit(0);
  }

  console.log("NO_CAPTIONS_AVAILABLE");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
