#!/usr/bin/env bun
const arg = process.argv[2];
if (arg === "--help" || arg === "-h") {
  console.log("Usage: SCHEDULE_FILE=path bun query.ts <filter>");
  console.log("Filters: today, tomorrow, upcoming, january, <keyword>");
  process.exit(0);
}

const filter = (arg ?? "upcoming").toLowerCase();
const scheduleFile = process.env.SCHEDULE_FILE || "ψ/inbox/schedule.md";
const targetSection = "January 2026";

const today = new Date();
const todayMonth = today.toLocaleString("en", { month: "short" });
const todayDay = today.getDate();
const tomorrow = todayDay + 1;

if (!(await Bun.file(scheduleFile).exists())) {
  console.error(`Schedule file not found: ${scheduleFile}`);
  process.exit(1);
}

const content = await Bun.file(scheduleFile).text();
const sections = parseSections(content);
const sectionContent = sections.get(targetSection) ?? "";

function parseSections(text: string): Map<string, string> {
  const map = new Map<string, string>();
  const lines = text.split("\n");
  let title: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (title) map.set(title, buffer.join("\n").trim());
      title = line.slice(3).trim();
      buffer = [];
      continue;
    }
    if (title) buffer.push(line);
  }

  if (title) map.set(title, buffer.join("\n").trim());
  return map;
}

function tableLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));
}

function sectionTable(section: string): string {
  return tableLines(section).join("\n");
}

function filterTableByTerm(section: string, term: string): string {
  const lines = tableLines(section);
  if (lines.length === 0) return "";

  const header = lines[0];
  const divider = lines.find((line) => /^\|\s*[-: ]+\|/.test(line)) ?? "| --- |";
  const dividerIndex = lines.indexOf(divider);
  const data = dividerIndex >= 0 ? lines.slice(dividerIndex + 1) : lines.slice(1);
  const matches = data.filter((line) => line.toLowerCase().includes(term.toLowerCase()));

  if (matches.length === 0) return "";
  return [header, divider, ...matches].join("\n");
}

function filterAllSectionsByKeyword(allSections: Map<string, string>, keyword: string): string {
  const blocks: string[] = [];
  for (const [title, body] of allSections) {
    const matchTable = filterTableByTerm(body, keyword);
    if (!matchTable) continue;
    blocks.push(`## ${title}\n\n${matchTable}`);
  }
  return blocks.join("\n\n");
}

let result = "";

switch (filter) {
  case "today":
    result = filterTableByTerm(sectionContent, `${todayMonth} ${todayDay}`);
    break;

  case "tomorrow":
    result = filterTableByTerm(sectionContent, `${todayMonth} ${tomorrow}`);
    break;

  case "january":
  case "jan":
  case "upcoming":
    result = sectionTable(sectionContent);
    break;

  default:
    result = filterAllSectionsByKeyword(sections, filter);
}

console.log(result || "No matches.");
