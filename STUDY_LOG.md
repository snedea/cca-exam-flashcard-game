# CCA Exam Study Log

Exam: Claude Certified Architect - Foundations, Friday June 19, 2026.
Plan: STUDY_PLAN.md. Drill format: exam-style multiple choice, scored per block,
misses re-tested in mutated form the next day.

## Day 1 - Wed Jun 10

**Covered:** Baseline quiz (one question per domain) + Domain 1 part 1 (agentic
loop, coordinator-subagent, decomposition) + Domain 1 part 2 preview (hooks,
enforcement, sessions).

**Score: 15/20 (75%)** - right at passing level before any study.

| Block | Score | Notes |
|---|---|---|
| Baseline Q1-5 | 4/5 | Missed Q1 (loop termination) |
| D1 part 1 Q6-10 | 4/5 | Missed Q10 (parallel subagents) |
| D1 part 1 Q11-15 | 4/5 | Missed Q14 (structured formats rationale) |
| D1 part 2 preview Q16-20 | 3/5 | Missed Q18 (hooks vs descriptions), Q19 (session resume) |

**Misses to re-test Day 2 (mutated):**
1. Loop termination = `stop_reason` (`"tool_use"` continue / `"end_turn"` stop). Never parse text.
2. Parallel subagents = multiple `Task` calls in ONE coordinator response. No `parallel` flag exists.
3. Structured inter-agent data = attribution/provenance, not parsing efficiency.
4. Hard business rules (thresholds, compliance) = hooks/programmatic gates, never tool
   descriptions or prompts. Descriptions are for tool SELECTION, not enforcement.
5. Resume after file changes = resume + inform agent what changed. Fresh-with-summary
   only when most prior context is stale.

**Diagnosis:** Strong architectural judgment (acing the "which approach" questions);
losing points on exact mechanisms - which field, which flag, which layer. Fix is
memorization of concrete mechanics.

**Distractor patterns learned:**
- Fictional features (`parallel: true`, `CLAUDE_HEADLESS`, `--batch`) - if it's not in
  the docs, it doesn't exist.
- Over-engineered options (classifiers, routing layers) lose to root-cause fixes.
- "First step" questions favor low-effort high-leverage fixes.

## Day 2 - Thu Jun 11 (planned)

Domain 1 part 2 in depth: Task tool + allowedTools, hook patterns (PostToolUse,
tool-call interception), prompt chaining vs dynamic decomposition, --resume /
fork_session. 10-question drill including mutated re-tests of the 5 Day-1 misses.
