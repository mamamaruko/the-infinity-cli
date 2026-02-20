#!/usr/bin/env bun

import { $ } from "bun";
import { sendAndAwait } from "../../gemini/scripts/client.js";

type Mode = "chat" | "research" | "canvas";
type Model = "fast" | "thinking" | "pro";

const modeUrls: Record<Mode, string> = {
  chat: "https://gemini.google.com/app",
  research: "https://gemini.google.com/app?mode=research",
  canvas: "https://gemini.google.com/canvas",
};

function usage(): never {
  console.log("Usage: bun transcribe.ts [--mode=chat|research|canvas] [--model=fast|thinking|pro] [custom title] <youtube-url>");
  process.exit(1);
}

const args = process.argv.slice(2);
let mode: Mode = "chat";
let model: Model | null = null;
let url = "";
const titleParts: string[] = [];

for (const arg of args) {
  if (arg.startsWith("--mode=")) {
    const value = arg.replace("--mode=", "") as Mode;
    if (!["chat", "research", "canvas"].includes(value)) usage();
    mode = value;
    continue;
  }
  if (arg.startsWith("--model=")) {
    const value = arg.replace("--model=", "") as Model;
    if (!["fast", "thinking", "pro"].includes(value)) usage();
    model = value;
    continue;
  }
  if (arg.startsWith("http")) {
    url = arg;
    continue;
  }
  titleParts.push(arg);
}

if (!url) usage();

const metadataScript = new URL("./get-metadata.ts", import.meta.url).pathname;
const rawMeta = await $`bun ${metadataScript} ${url}`.text();

let metadata: {
  title: string;
  channel: string;
  duration_string: string;
  id: string;
};

try {
  metadata = JSON.parse(rawMeta.trim());
} catch {
  console.error("Failed to read metadata from yt-dlp output.");
  process.exit(1);
}

const title = titleParts.join(" ").trim() || metadata.title;
const promptHeader = JSON.stringify({
  title,
  channel: metadata.channel,
  duration: metadata.duration_string,
  url,
});

const promptByMode: Record<Mode, string> = {
  chat: `Please transcribe this YouTube video with timestamps.\n\n\`\`\`json\n${promptHeader}\n\`\`\`\n\nFormat as [mm:ss] text with blank lines between sections.`,
  research: `Deep research this YouTube video and provide transcript + fact-check notes.\n\n\`\`\`json\n${promptHeader}\n\`\`\``,
  canvas: `Create a structured document from this YouTube video: summary, transcript with timestamps, and key insights.\n\n\`\`\`json\n${promptHeader}\n\`\`\``,
};

const created = await sendAndAwait("create_tab", { url: modeUrls[mode] }, 10);
const tabId = Number(created.tabId);
if (!Number.isFinite(tabId)) {
  console.error("Could not resolve Gemini tab id.");
  process.exit(1);
}

await Bun.sleep(mode === "research" ? 5000 : 3000);

if (model) {
  await sendAndAwait("select_model", { model, tabId }, 8).catch(() => undefined);
}

const chat = await sendAndAwait("chat", { tabId, text: promptByMode[mode] }, 12);
if (chat.success === false) {
  console.error(`Gemini chat failed: ${String(chat.error ?? "unknown error")}`);
  process.exit(1);
}

const output = {
  title,
  url,
  videoId: metadata.id,
  channel: metadata.channel,
  duration: metadata.duration_string,
  tabId,
  mode,
  model: model ?? "default",
};

console.log(JSON.stringify(output, null, 2));
