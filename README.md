# CCA Exam Flashcard Game

Static study app for the Claude Certified Architect - Foundations exam, plus a
repeatable workflow for studying with Claude Code as your personal tutor.

## Get the Official Exam Guide

The official exam guide PDF is **not included in this repo** because it is marked
Confidential NTK and distributed only through Anthropic's certification portal.
Get your own copy:

1. Request access at [anthropic.skilljar.com](https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request)
   (Anthropic Academy is free; the exam is currently available to partner-company employees).
2. Download the exam guide PDF from inside Skilljar.
3. Save it to `assets/CCA-Exam-Guide.pdf` in your clone of this repo.

The flashcard game works without the PDF. The PDF enables the `Prove it` page links
and the Claude Code study workflow below.

## Run the Game Locally

```bash
python3 -m http.server 8787 --bind 0.0.0.0
```

Open `http://localhost:8787/` on desktop. From a phone on the same network, open the
host machine's LAN IP with the same port.

## Study with Claude Code (the tutor workflow)

This repo doubles as a study environment for [Claude Code](https://claude.com/claude-code).
The whole loop that produced `STUDY_PLAN.md` and `STUDY_LOG.md` was driven by one
prompt. To replicate it:

1. Clone this repo and put the official PDF at `assets/CCA-Exam-Guide.pdf` (see above).
2. Launch `claude` in the repo directory.
3. Prompt it with your real exam date:

   > Help me study for the exam using material from assets/CCA-Exam-Guide.pdf.
   > My exam is on <date>. Create a day-by-day learning plan, save it to
   > STUDY_PLAN.md, then start quizzing me right now with exam-style multiple
   > choice questions. Score each block, explain every miss, and log results
   > to STUDY_LOG.md.

4. At the end of each session: "Record today's activity." Claude appends scores,
   misses, and a next-day agenda to `STUDY_LOG.md`.
5. Next session: "Quiz me." Claude reads the log, re-tests your previous misses in
   mutated form, then moves to the day's topic.

What makes this work well in practice:

- **Day-by-day plan weighted by domain percentages** - heaviest domains get the most days.
- **5-question blocks, scored immediately** - misses are explained against the guide,
  then re-tested the next day in disguised form so you can't pattern-match.
- **A persistent log** (`STUDY_LOG.md`) - any future session (or a fresh Claude
  instance) can pick up exactly where you left off, including your weak spots and
  the distractor patterns you keep falling for.
- **The exam's own style** - scenario-grounded multiple choice with one correct
  answer and three plausible distractors, matching the real format (60 questions,
  120 minutes, 720/1000 to pass).

`STUDY_PLAN.md` and `STUDY_LOG.md` in this repo are a real worked example from one
candidate's prep - replace them with your own.

## Add Sources Later

The app supports future sources in two ways:

1. Use the in-app `Sources` tab and paste a source JSON object. This saves to local storage on that device.
2. Add source objects to `data/sources.js`, redeploy the site, and the source becomes available to every device.

A source object needs:

- `id`
- `title`
- `sourcePath` when `Prove it` should open a PDF or web source
- `domains`
- `cards`
- `questions`
- optional `questionSupport` entries for `Explain it`, `Cite it`, and PDF page links

Use the `Sources` tab's `Show template` button for the exact shape.
