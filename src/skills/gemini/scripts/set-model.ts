#!/usr/bin/env bun

import { sendAndAwait } from "./client.js";

const MODELS = new Set(["fast", "thinking", "pro"]);

function usage(): never {
  console.log("Usage: bun set-model.ts <fast|thinking|pro> [--tab <id>]");
  process.exit(1);
}

const argv = process.argv.slice(2);
const model = argv[0];
if (!model || !MODELS.has(model)) usage();

let tabId: number | undefined;
for (let i = 1; i < argv.length; i += 1) {
  if (argv[i] === "--tab") {
    const next = argv[i + 1];
    if (!next) usage();
    const parsed = Number(next);
    if (!Number.isFinite(parsed)) usage();
    tabId = parsed;
    i += 1;
  }
}

const payload: Record<string, unknown> = { model };
if (tabId !== undefined) payload.tabId = tabId;

const response = await sendAndAwait("select_model", payload, 8);
if (response.success === false) {
  console.error(`Model selection failed: ${String(response.error ?? "unknown error")}`);
  process.exit(1);
}

console.log(`✓ Selected model: ${model}`);
if (tabId !== undefined) console.log(`Tab ID: ${tabId}`);
