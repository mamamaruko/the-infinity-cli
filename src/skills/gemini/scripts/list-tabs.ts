#!/usr/bin/env bun

import { sendAndAwait } from "./client.js";

const jsonMode = process.argv.includes("--json");

const response = await sendAndAwait("list_tabs", {}, 7);
const tabs = Array.isArray(response.tabs) ? response.tabs : [];

if (jsonMode) {
  console.log(JSON.stringify({ count: tabs.length, tabs }, null, 2));
  process.exit(0);
}

console.log(`\nGemini tabs (${tabs.length})\n`);
if (tabs.length === 0) {
  console.log("No tabs found.");
  process.exit(0);
}

for (const item of tabs) {
  const tab = item as { id?: number; title?: string; url?: string; active?: boolean };
  const mark = tab.active ? "⭐" : "-";
  console.log(`${mark} ${String(tab.id ?? "?")} | ${String(tab.title ?? "(untitled)")} | ${String(tab.url ?? "")}`);
}
