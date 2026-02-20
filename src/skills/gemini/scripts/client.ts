#!/usr/bin/env bun

type JsonObject = Record<string, unknown>;

const MQTT_HOST = process.env.MQTT_HOST || "localhost";
const MQTT_PORT = process.env.MQTT_PORT || "1883";
const TOPIC_CMD = process.env.GEMINI_TOPIC_CMD || "claude/browser/command";
const TOPIC_RSP = process.env.GEMINI_TOPIC_RSP || "claude/browser/response";
const TOPIC_STATUS = process.env.GEMINI_TOPIC_STATUS || "claude/browser/status";

function hasCommand(command: string): boolean {
  return Bun.which(command) !== null;
}

export function assertPrerequisites(): void {
  const missing: string[] = [];
  if (!hasCommand("mosquitto_pub")) missing.push("mosquitto_pub");
  if (!hasCommand("mosquitto_sub")) missing.push("mosquitto_sub");

  if (missing.length > 0) {
    console.error(`Missing required commands: ${missing.join(", ")}`);
    console.error("Install mosquitto client tools first.");
    process.exit(1);
  }
}

function parseJsonLines(output: string): JsonObject[] {
  const lines = output.split("\n").map((line) => line.trim()).filter(Boolean);
  const parsed: JsonObject[] = [];

  for (const line of lines) {
    try {
      const value: unknown = JSON.parse(line);
      if (value && typeof value === "object") parsed.push(value as JsonObject);
    } catch {}
  }

  return parsed;
}

async function publish(payload: JsonObject): Promise<void> {
  const message = JSON.stringify(payload);
  const proc = Bun.spawn([
    "mosquitto_pub",
    "-h",
    MQTT_HOST,
    "-p",
    MQTT_PORT,
    "-t",
    TOPIC_CMD,
    "-m",
    message,
  ], { stdout: "pipe", stderr: "pipe" });

  const stderr = await new Response(proc.stderr).text();
  const code = await proc.exited;

  if (code !== 0) {
    throw new Error(stderr.trim() || "Failed to publish MQTT command");
  }
}

async function waitForResponse(requestId: string, timeoutSec: number): Promise<JsonObject> {
  const proc = Bun.spawn([
    "mosquitto_sub",
    "-h",
    MQTT_HOST,
    "-p",
    MQTT_PORT,
    "-t",
    TOPIC_RSP,
    "-C",
    "30",
    "-W",
    String(timeoutSec),
  ], { stdout: "pipe", stderr: "pipe" });

  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (code !== 0 && !stdout.trim()) {
    throw new Error(stderr.trim() || "No MQTT response received");
  }

  const messages = parseJsonLines(stdout);
  const matching = messages.find((msg) => msg.id === requestId);

  if (!matching) {
    throw new Error("Timed out waiting for matching response id");
  }

  return matching;
}

export async function sendCommand(action: string, params: JsonObject = {}, timeoutSec = 10): Promise<JsonObject> {
  assertPrerequisites();

  const requestId = `${action}_${Date.now()}`;
  const subProc = Bun.spawn([
    "mosquitto_sub",
    "-h",
    MQTT_HOST,
    "-p",
    MQTT_PORT,
    "-t",
    TOPIC_RSP,
    "-C",
    "30",
    "-W",
    String(timeoutSec),
  ], { stdout: "pipe", stderr: "pipe" });

  await Bun.sleep(150);
  await publish({ id: requestId, action, ts: Date.now(), ...params });

  const [stdout, stderr, code] = await Promise.all([
    new Response(subProc.stdout).text(),
    new Response(subProc.stderr).text(),
    subProc.exited,
  ]);

  if (code !== 0 && !stdout.trim()) {
    throw new Error(stderr.trim() || "No MQTT response received");
  }

  const messages = parseJsonLines(stdout);
  const matching = messages.find((msg) => msg.id === requestId);
  if (!matching) {
    throw new Error("Timed out waiting for matching response id");
  }

  return matching;
}

export async function readStatus(timeoutSec = 2): Promise<JsonObject | null> {
  assertPrerequisites();

  const proc = Bun.spawn([
    "mosquitto_sub",
    "-h",
    MQTT_HOST,
    "-p",
    MQTT_PORT,
    "-t",
    TOPIC_STATUS,
    "-C",
    "1",
    "-W",
    String(timeoutSec),
  ], { stdout: "pipe", stderr: "pipe" });

  const stdout = await new Response(proc.stdout).text();
  await proc.exited;
  const messages = parseJsonLines(stdout);
  return messages[0] || null;
}

export function topics() {
  return {
    host: MQTT_HOST,
    port: MQTT_PORT,
    cmd: TOPIC_CMD,
    rsp: TOPIC_RSP,
    status: TOPIC_STATUS,
  };
}

export async function sendAndAwait(action: string, params: JsonObject = {}, timeoutSec = 10): Promise<JsonObject> {
  return sendCommand(action, params, timeoutSec);
}

export async function publishOnly(action: string, params: JsonObject = {}): Promise<void> {
  assertPrerequisites();
  await publish({ id: `${action}_${Date.now()}`, action, ts: Date.now(), ...params });
}

export async function waitResponseById(requestId: string, timeoutSec = 10): Promise<JsonObject> {
  return waitForResponse(requestId, timeoutSec);
}
