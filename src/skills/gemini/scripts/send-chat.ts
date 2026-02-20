#!/usr/bin/env bun

import { sendAndAwait } from "./client.js";

type Parsed = {
  message: string;
  tabId?: number;
  newTab: boolean;
  timeout: number;
};

function usage(): never {
  console.log("Usage: bun send-chat.ts [--tab <id>] [--new-tab] [--timeout <sec>] <message>");
  process.exit(1);
}

function parseArgs(argv: string[]): Parsed {
  let tabId: number | undefined;
  let newTab = false;
  let timeout = 10;
  const parts: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--tab") {
      const next = argv[i + 1];
      if (!next) usage();
      const parsed = Number(next);
      if (!Number.isFinite(parsed)) usage();
      tabId = parsed;
      i += 1;
      continue;
    }
    if (arg === "--new-tab") {
      newTab = true;
      continue;
    }
    if (arg === "--timeout") {
      const next = argv[i + 1];
      if (!next) usage();
      const parsed = Number(next);
      if (!Number.isFinite(parsed) || parsed <= 0) usage();
      timeout = parsed;
      i += 1;
      continue;
    }
    parts.push(arg);
  }

  const message = parts.join(" ").trim();
  if (!message) usage();

  return { message, tabId, newTab, timeout };
}

const args = parseArgs(process.argv.slice(2));

let targetTab = args.tabId;
if (args.newTab || targetTab === undefined) {
  const created = await sendAndAwait("create_tab", { url: "https://gemini.google.com/app" }, args.timeout);
  const createdId = Number(created.tabId);
  if (Number.isFinite(createdId)) {
    targetTab = createdId;
  }
  await Bun.sleep(3000);
}

const payload: Record<string, unknown> = { text: args.message };
if (targetTab !== undefined) payload.tabId = targetTab;

const response = await sendAndAwait("chat", payload, args.timeout);

if (response.success === false) {
  console.error(`Chat failed: ${String(response.error ?? "unknown error")}`);
  process.exit(1);
}

console.log("✓ Message sent to Gemini");
if (targetTab !== undefined) console.log(`Tab ID: ${targetTab}`);
