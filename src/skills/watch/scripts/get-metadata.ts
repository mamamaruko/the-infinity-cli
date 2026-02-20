#!/usr/bin/env bun

import { $ } from "bun";

const url = process.argv[2];

if (!url) {
  console.error("Usage: bun get-metadata.ts <youtube-url>");
  process.exit(1);
}

if (!Bun.which("yt-dlp")) {
  console.error("Missing required command: yt-dlp");
  console.error("Install with: brew install yt-dlp");
  process.exit(1);
}

const raw = await $`yt-dlp --dump-json --no-download ${url}`.json();

const metadata = {
  title: String(raw.title ?? "Untitled video"),
  description: typeof raw.description === "string" ? raw.description.split("\n").slice(0, 5).join("\n") : "",
  duration: Number(raw.duration ?? 0),
  duration_string: String(raw.duration_string ?? ""),
  channel: String(raw.channel ?? ""),
  upload_date: String(raw.upload_date ?? ""),
  view_count: Number(raw.view_count ?? 0),
  id: String(raw.id ?? ""),
  url,
};

console.log(JSON.stringify(metadata));
