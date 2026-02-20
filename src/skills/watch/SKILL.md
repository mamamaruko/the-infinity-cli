---
name: watch
description: Learn from YouTube videos through Gemini transcription and save learnings. Use when user says "watch", "transcribe youtube", "learn from video", or shares a YouTube URL.
alias: /gemini transcribe
---

# /watch - YouTube -> Gemini -> Learning Memory

Learn from a YouTube video by sending it to Gemini, then save the result as a learning note.

## Usage

```bash
/watch https://youtube.com/watch?v=xxx
/watch "Custom title" https://youtu.be/xxx
/watch --mode=research https://youtube.com/...
/watch --model=thinking https://youtube.com/...
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/transcribe.ts` | Create Gemini tab and send transcription prompt |
| `scripts/get-metadata.ts` | Fetch title/channel/duration with yt-dlp |
| `scripts/get-cc.ts` | Fetch YouTube captions (SRT) |
| `scripts/save-learning.ts` | Persist transcript as markdown in `ψ/memory/learnings/` |

## Step 1: Run transcribe

```bash
bun scripts/transcribe.ts $ARGUMENTS
```

## Step 2: Wait for Gemini answer

Read transcript from Gemini tab.

## Step 3: Save to learning file

```bash
bun scripts/save-learning.ts "<title>" "<url>" "<video_id>" "<transcript>" "<cc_text>" "<gemini_url>"
```

Or pass transcript via stdin:

```bash
cat transcript.txt | bun scripts/save-learning.ts "<title>" "<url>" "<video_id>"
```

## Notes

- Requires `yt-dlp` for metadata/captions
- Requires Gemini bridge prerequisites from `/gemini`
- For very long videos, let Gemini finish before saving

---

ARGUMENTS: $ARGUMENTS
