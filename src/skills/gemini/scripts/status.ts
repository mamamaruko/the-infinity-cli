#!/usr/bin/env bun

import { readStatus, sendAndAwait, topics } from "./client.js";

type GeminiTab = {
  id?: number;
  title?: string;
  url?: string;
  active?: boolean;
};

function formatTime(value: unknown): string {
  if (typeof value !== "number") return "unknown";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const status = await readStatus();
const topicSet = topics();

console.log("\n🔮 Gemini Bridge Status\n");
console.log("═".repeat(56));

if (!status) {
  console.log("\n🔴 Extension: OFFLINE or no retained status");
  console.log("   Open extension sidebar and confirm MQTT bridge connected.");
  process.exit(1);
}

const state = status.status === "online" ? "🟢 ONLINE" : "🔴 OFFLINE";
console.log(`\n${state}`);
console.log(`   Version: ${String(status.version ?? "unknown")}`);
console.log(`   Last seen: ${formatTime(status.timestamp)}`);

let tabs: GeminiTab[] = [];
try {
  const response = await sendAndAwait("list_tabs", {}, 7);
  const value = response.tabs;
  if (Array.isArray(value)) tabs = value as GeminiTab[];
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`\n⚠️ Could not fetch tab list: ${message}`);
}

console.log("\n📑 Tabs:");
if (tabs.length === 0) {
  console.log("   No Gemini tabs found");
} else {
  for (const tab of tabs) {
    const activeMark = tab.active ? "⭐" : "  ";
    const id = String(tab.id ?? "?");
    const title = String(tab.title ?? "(untitled)").slice(0, 36);
    const url = String(tab.url ?? "").replace("https://gemini.google.com", "");
    console.log(`   ${activeMark} ${id.padEnd(10)} ${title.padEnd(36)} ${url}`);
  }
}

console.log("\n📡 Topics:");
console.log(`   Host: ${topicSet.host}:${topicSet.port}`);
console.log(`   Command:  ${topicSet.cmd}`);
console.log(`   Response: ${topicSet.rsp}`);
console.log(`   Status:   ${topicSet.status}`);
console.log("\n" + "═".repeat(56));
