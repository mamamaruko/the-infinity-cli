#!/usr/bin/env bun

import { mkdirSync, existsSync, appendFileSync } from "fs";
import { dirname, join } from "path";

const title = process.argv[2];
const url = process.argv[3];
const videoId = process.argv[4];
const transcriptArg = process.argv[5];
const ccTextArg = process.argv[6];
const geminiUrl = process.argv[7] || "";

if (!title || !url || !videoId) {
  console.error("Usage: ROOT=/path bun save-learning.ts <title> <url> <video_id> [transcript] [cc_text] [gemini_url]");
  process.exit(1);
}

const root = process.env.ROOT || process.cwd();
const learnDir = join(root, "ψ/memory/learnings");
const slugsFile = join(root, "ψ/memory/slugs.yaml");

mkdirSync(learnDir, { recursive: true });
mkdirSync(dirname(slugsFile), { recursive: true });

const transcriptFromStdin = await new Response(Bun.stdin.stream()).text();
const transcript = (transcriptArg || transcriptFromStdin).trim();
if (!transcript) {
  console.error("Transcript is required (arg 5 or stdin).");
  process.exit(1);
}

const ccText = (ccTextArg || "NO_CAPTIONS_AVAILABLE").trim();
const hasCc = ccText !== "NO_CAPTIONS_AVAILABLE";

const date = new Date().toISOString().slice(0, 10);
const slugBase = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 60) || "video";

let slug = slugBase;
let filePath = join(learnDir, `${date}_${slug}.md`);
let index = 1;
while (existsSync(filePath)) {
  slug = `${slugBase}-${index}`;
  filePath = join(learnDir, `${date}_${slug}.md`);
  index += 1;
}

const content = `---
title: ${title}
tags: [youtube, transcript, gemini, watch]
source: ${url}
video_id: ${videoId}
created: ${date}
has_cc: ${hasCc}
transcribed_by: Gemini
gemini_conversation: ${geminiUrl || ""}
---

# ${title}

## Source
- YouTube: ${url}
- Video ID: ${videoId}
- Gemini conversation: ${geminiUrl || "(add later)"}

## Transcript

${transcript}

## Captions

${ccText}

---
Added via /watch skill.
`;

await Bun.write(filePath, content);

if (!existsSync(slugsFile)) {
  await Bun.write(slugsFile, "# Slug Registry\n");
}
appendFileSync(slugsFile, `${slug}: ${filePath}\n`);

console.log(`✅ Saved: ${filePath}`);
console.log(`📎 Slug: ${slug}`);
