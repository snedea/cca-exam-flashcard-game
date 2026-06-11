# CCA Foundations Exam Study Plan

Exam: Claude Certified Architect - Foundations
Exam date: Friday, June 19, 2026
Source: assets/CCA-Exam-Guide.pdf

## Exam facts
- All multiple choice, 1 correct + 3 distractors. No guessing penalty: answer everything.
- Scaled score 100-1000, passing 720.
- 4 scenarios drawn at random from 6 known scenarios (support agent, Claude Code codegen,
  multi-agent research, dev productivity, CI/CD, structured extraction).
- Domain weights: D1 Agentic Architecture 27% | D3 Claude Code Config 20% |
  D4 Prompt Eng & Structured Output 20% | D2 Tool Design & MCP 18% | D5 Context & Reliability 15%.

## Day-by-day plan

### Wed Jun 10 (today) - Baseline + Domain 1 part 1
- Baseline quiz (5 mixed questions, one per domain) to find weak spots.
- Domain 1: agentic loop lifecycle (stop_reason tool_use vs end_turn), tool results
  appended to history, model-driven vs hardcoded decision trees.
- Coordinator-subagent: hub-and-spoke, isolated subagent context, decomposition risks.
- Drill: 10 D1 questions.

### Thu Jun 11 - Domain 1 part 2
- Subagent spawning: Task tool, allowedTools must include "Task", explicit context
  passing, parallel Task calls in one response.
- Enforcement: hooks (PostToolUse, tool-call interception) vs prompt guidance;
  deterministic compliance for financial ops.
- Task decomposition: prompt chaining vs dynamic decomposition.
- Sessions: --resume, fork_session, resume vs fresh-with-summary.
- Drill: 10 D1 questions. D1 is 27% - it must be solid before moving on.

### Fri Jun 12 - Domain 2 (Tool Design & MCP)
- Tool descriptions as primary selection mechanism; fixing overlap (rename/split).
- Structured errors: isError, errorCategory, isRetryable, transient vs validation vs
  business vs permission; access failure vs valid empty result.
- Tool distribution: fewer tools per agent, scoped cross-role tools, tool_choice
  auto/any/forced.
- MCP config: project .mcp.json vs user ~/.claude.json, ${ENV_VAR} expansion,
  MCP resources for catalogs.
- Built-ins: Grep (content) vs Glob (paths) vs Read/Write/Edit.
- Drill: 10 D2 questions.

### Sat Jun 13 - Domain 3 (Claude Code Config & Workflows)
- CLAUDE.md hierarchy: user ~/.claude/CLAUDE.md vs project vs directory; @import;
  .claude/rules/ with YAML frontmatter paths globs.
- Commands (.claude/commands/ project vs ~/.claude/commands/ personal) and skills
  (.claude/skills/ SKILL.md: context: fork, allowed-tools, argument-hint).
- Plan mode vs direct execution; Explore subagent.
- Iterative refinement: input/output examples, test-driven iteration, interview pattern.
- CI/CD: -p / --print, --output-format json, --json-schema, independent review instance.
- Hands-on: poke at this repo's .claude/ setup as a live example.
- Drill: 10 D3 questions.

### Sun Jun 14 - Domain 4 (Prompt Engineering & Structured Output)
- Explicit criteria > vague instructions ("be conservative" fails); false-positive
  categories undermine trust.
- Few-shot: 2-4 targeted examples for ambiguous cases, format demonstration,
  generalization, hallucination reduction.
- Structured output: tool_use + JSON schema (eliminates syntax errors, not semantic);
  tool_choice auto vs any vs forced; nullable fields prevent fabrication;
  "other"+detail and "unclear" enums.
- Validation-retry with error feedback; when retries can't help (info absent).
- Batch API: 50% cheaper, <=24h window, no SLA, no multi-turn tools, custom_id;
  blocking vs latency-tolerant workloads.
- Multi-pass review: per-file + integration pass; independent reviewer > self-review.
- Drill: 10 D4 questions.

### Mon Jun 15 - Domain 5 (Context Management & Reliability)
- Summarization risks, lost-in-the-middle, case-facts blocks, trimming verbose tool
  output, metadata in structured outputs.
- Escalation: honor explicit human requests immediately; policy gaps escalate;
  sentiment/self-confidence are bad proxies; multiple matches -> ask for identifiers.
- Error propagation: structured error context (failure type, attempted query, partial
  results, alternatives); local recovery first; never silent-suppress or kill workflow.
- Codebase exploration: scratchpads, subagent delegation, /compact, crash-recovery
  manifests.
- Human review: stratified sampling, field-level confidence calibrated on labeled sets,
  segment accuracy by doc type before automating.
- Provenance: claim-source mappings, conflict annotation, publication dates.
- Drill: 10 D5 questions.

### Tue Jun 16 - Mixed scenario day
- Full mixed quiz: ~24 questions, 4 per scenario across all 6 scenarios, exam style.
- Review every miss against the guide. Re-drill the two weakest domains.

### Wed Jun 17 - Practice exam
- Take the official practice exam (link provided separately per guide) or a full
  simulated 4-scenario exam here. Target comfortably above 720-equivalent.
- Review all misses; write a one-page "facts I keep missing" sheet.

### Thu Jun 18 - Light review
- Skim the facts sheet and the Appendix (Technologies and Concepts + In-Scope Topics).
- Quick flashcard pass on memorizable facts: flags (-p, --output-format json,
  --json-schema), file paths (.mcp.json, .claude/rules/, .claude/skills/), batch API
  numbers (50%, 24h), tool_choice values, stop_reason values.
- No new material. Stop early.

### Fri Jun 19 - Exam day
- 15-minute skim of facts sheet only. Answer every question (no penalty).
- Distractor patterns to remember: over-engineered options (classifiers, routing
  layers) lose to root-cause fixes; prompt-only enforcement loses to programmatic
  hooks when compliance is mandatory; "first step" questions favor low-effort
  high-leverage fixes.

## Recurring drill format
Exam-style scenario questions, 4 options, answer + explanation after each block.
Track misses by domain; re-weight following day toward weak domains.
