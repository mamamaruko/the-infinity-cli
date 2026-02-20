#!/usr/bin/env bun

import { sendAndAwait } from "./client.js";

const topic = process.argv.slice(2).join(" ").trim();
if (!topic) {
  console.log("Usage: bun deep-research.ts <topic>");
  process.exit(1);
}

console.log(`\n🔬 Deep Research: ${topic}\n`);

const created = await sendAndAwait("create_tab", { url: "https://gemini.google.com/app?mode=research" }, 10);
const tabId = Number(created.tabId);
if (!Number.isFinite(tabId)) {
  console.error("Could not resolve tab id from create_tab response.");
  process.exit(1);
}

await Bun.sleep(4000);

await sendAndAwait("select_mode", { mode: "Deep Research", tabId }, 8).catch(() => undefined);

const chat = await sendAndAwait("chat", { tabId, text: topic }, 10);
if (chat.success === false) {
  console.error(`Failed to send research prompt: ${String(chat.error ?? "unknown error")}`);
  process.exit(1);
}

await sendAndAwait("clickText", { tabId, text: "Start research" }, 8).catch(() => undefined);

console.log("✓ Deep research flow started");
console.log(`Tab ID: ${tabId}`);
