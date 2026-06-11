window.CCA_SOURCES = [
  {
    id: "cca-foundations-guide-v0-1",
    title: "Claude Certified Architect - Foundations",
    label: "CCA Foundations Guide",
    sourceType: "pdf",
    sourcePath: "assets/CCA-Exam-Guide.pdf",
    localSourcePath: "../context-foundry/docs/CCA-Exam-Guide.pdf",
    version: "0.1",
    updated: "2025-02-10",
    summary:
      "Study pack derived from the local CCA exam guide. Cards and questions are paraphrased for active recall.",
    domains: [
      {
        id: "d1",
        title: "Agentic Architecture & Orchestration",
        weight: 27,
        short: "Agents",
        color: "#1d7f78",
        focus:
          "Agent loops, coordinator/subagent patterns, hooks, task decomposition, session state, and handoffs."
      },
      {
        id: "d2",
        title: "Tool Design & MCP Integration",
        weight: 18,
        short: "Tools",
        color: "#b66a1e",
        focus:
          "Tool interfaces, structured errors, tool distribution, MCP resources, and server scoping."
      },
      {
        id: "d3",
        title: "Claude Code Configuration & Workflows",
        weight: 20,
        short: "Code",
        color: "#6d5bd0",
        focus:
          "CLAUDE.md hierarchy, rules, skills, MCP config, plan mode, CLI automation, and team workflows."
      },
      {
        id: "d4",
        title: "Prompt Engineering & Structured Output",
        weight: 20,
        short: "Prompts",
        color: "#c84d5b",
        focus:
          "Explicit criteria, few-shot examples, JSON schemas, validation retries, and batch processing."
      },
      {
        id: "d5",
        title: "Context Management & Reliability",
        weight: 15,
        short: "Reliability",
        color: "#457b43",
        focus:
          "Context windows, scratchpads, escalation, provenance, confidence routing, and graceful degradation."
      }
    ],
    scenarios: [
      {
        id: "s1",
        title: "Customer Support Resolution Agent",
        domains: ["d1", "d2", "d5"],
        brief:
          "A support agent handles returns, billing disputes, account issues, backend MCP tools, refunds, and escalation."
      },
      {
        id: "s2",
        title: "Code Generation with Claude Code",
        domains: ["d3", "d5"],
        brief:
          "A team uses Claude Code for generation, refactoring, debugging, docs, slash commands, config, and plan mode."
      },
      {
        id: "s3",
        title: "Multi-Agent Research System",
        domains: ["d1", "d2", "d5"],
        brief:
          "A coordinator delegates to search, document analysis, synthesis, and report-writing subagents."
      },
      {
        id: "s4",
        title: "Developer Productivity with Claude",
        domains: ["d1", "d2", "d3"],
        brief:
          "Developer tools explore codebases, generate boilerplate, automate repeated tasks, and use built-in tools plus MCP."
      },
      {
        id: "s5",
        title: "Claude Code in CI/CD",
        domains: ["d3", "d4"],
        brief:
          "Automated review and test feedback run in pipelines, so prompts must be actionable and low-noise."
      },
      {
        id: "s6",
        title: "Structured Data Extraction",
        domains: ["d4", "d5"],
        brief:
          "A system extracts fields from messy documents, validates schemas, handles edge cases, and routes uncertain data."
      }
    ],
    prep: [
      "Build an agentic loop that handles tool_use and end_turn correctly.",
      "Configure a real project with CLAUDE.md, path rules, skills, and MCP servers.",
      "Design MCP tools with differentiated descriptions and structured error metadata.",
      "Create a structured extraction workflow with schemas, validation retries, and nullable fields.",
      "Practice few-shot prompt design and explicit review criteria.",
      "Use scratchpad files and handoff summaries for long or multi-agent workflows.",
      "Design human review routing using confidence and policy criteria."
    ],
    inScope: [
      "stop_reason loop control",
      "coordinator and subagent orchestration",
      "explicit subagent context passing",
      "tool description quality",
      "MCP resources versus tools",
      "CLAUDE.md and path-scoped rules",
      "skills with restricted tools",
      "plan mode tradeoffs",
      "tool_use structured output",
      "validation retry loops",
      "few-shot examples",
      "Message Batches fit",
      "lost-in-the-middle mitigation",
      "human review routing",
      "source provenance"
    ],
    outOfScope: [
      "fine-tuning Claude",
      "Claude account billing",
      "hosting MCP infrastructure",
      "Claude internal model architecture",
      "vision and computer use",
      "cloud-provider-specific setup",
      "tokenization algorithms"
    ],
    questionSupport: {
      "q-d1-loop-1": {
        hint: "Ask what Claude needs in context before choosing the next action.",
        explain:
          "Tool calls are not the finish line. The loop continues by returning the tool result to Claude, then Claude decides whether another tool is needed or whether it can answer.",
        citations: [
          {
            page: 4,
            section: "Task Statement 1.1",
            locator: "Knowledge of and Skills in agentic loop lifecycle",
            support: "The guide describes continuing on tool_use, executing tools, and returning results for the next iteration."
          }
        ]
      },
      "q-d1-loop-2": {
        hint: "Prefer structured API state over prose.",
        explain:
          "The reliable completion signal is stop_reason=end_turn. Parsing assistant wording, code blocks, or confidence language is brittle.",
        citations: [
          {
            page: 4,
            section: "Task Statement 1.1",
            locator: "Skills in avoiding loop termination anti-patterns",
            support: "The guide warns against natural-language completion checks and arbitrary iteration caps as primary loop controls."
          }
        ]
      },
      "q-d1-subagent-1": {
        hint: "Subagents do not inherit memory by default.",
        explain:
          "A synthesis agent can only synthesize what it receives. The coordinator must pass relevant findings, evidence, and metadata explicitly.",
        citations: [
          {
            page: 6,
            section: "Task Statement 1.3",
            locator: "Knowledge of subagent context passing",
            support: "The guide states that subagent context must be explicitly provided in the prompt."
          }
        ]
      },
      "q-d1-parallel-1": {
        hint: "Parallel means same coordinator turn, not one subagent after another.",
        explain:
          "When tasks are independent, the coordinator can emit multiple Task calls in one response, allowing the runtime to fan out work.",
        citations: [
          {
            page: 6,
            section: "Task Statement 1.3",
            locator: "Skills in spawning parallel subagents",
            support: "The guide calls out spawning parallel subagents by emitting multiple Task calls in a single coordinator response."
          }
        ]
      },
      "q-d1-gate-1": {
        hint: "If failure is unacceptable, do not rely only on a prompt.",
        explain:
          "Policy and compliance rules need deterministic enforcement. A hook or gate can block the risky call before it happens.",
        citations: [
          {
            page: 7,
            section: "Task Statement 1.5",
            locator: "Skills in tool call interception hooks",
            support: "The guide describes blocking policy-violating actions and redirecting to escalation workflows."
          }
        ]
      },
      "q-d1-decomp-1": {
        hint: "The problem is attention dilution.",
        explain:
          "A single broad pass over many files can miss local details and cross-file issues. Split the task into focused local analysis, then integration analysis.",
        citations: [
          {
            page: 32,
            section: "Question 12",
            locator: "Sample question explanation",
            support: "The sample question recommends file-by-file analysis plus a separate integration-focused pass."
          },
          {
            page: 20,
            section: "Task Statement 4.6",
            locator: "Multi-pass review architectures",
            support: "The guide covers multi-instance and multi-pass review for larger code reviews."
          }
        ]
      },
      "q-d1-resume-1": {
        hint: "Stale tool output is worse than no tool output.",
        explain:
          "When the repo has changed, start fresh with a concise, current summary rather than resuming with obsolete observations.",
        citations: [
          {
            page: 8,
            section: "Task Statement 1.7",
            locator: "Skills in choosing resume versus fresh summary",
            support: "The guide says a fresh session with a structured summary is more reliable when prior tool results are stale."
          }
        ]
      },
      "q-d2-desc-1": {
        hint: "The model chooses tools from descriptions.",
        explain:
          "Ambiguous descriptions make the model guess. Good tool design narrows when and why a tool should be used.",
        citations: [
          {
            page: 9,
            section: "Task Statement 2.1",
            locator: "Knowledge of tool descriptions and boundaries",
            support: "The guide identifies tool descriptions as the primary mechanism for LLM tool selection."
          },
          {
            page: 25,
            section: "Question 2",
            locator: "Sample question about get_customer misrouting",
            support: "The sample question addresses tool misselection caused by description and prompt issues."
          }
        ]
      },
      "q-d2-error-1": {
        hint: "The agent needs to know whether retry makes sense.",
        explain:
          "A timeout is different from a validation error or policy rejection. Structured metadata lets the agent recover appropriately.",
        citations: [
          {
            page: 10,
            section: "Task Statement 2.2",
            locator: "Skills in structured error metadata",
            support: "The guide calls for error category, retryability, and human-readable descriptions."
          }
        ]
      },
      "q-d2-empty-1": {
        hint: "No matches is not the same as failure.",
        explain:
          "A successful query can return an empty set. Treating it as an error would trigger the wrong recovery path.",
        citations: [
          {
            page: 10,
            section: "Task Statement 2.2",
            locator: "Skills in distinguishing access failures from empty results",
            support: "The guide explicitly separates access failures from valid empty results."
          }
        ]
      },
      "q-d2-tools-1": {
        hint: "Scope tools to the role.",
        explain:
          "A synthesis agent should synthesize evidence. If it has search tools, it may wander instead of using the curated findings.",
        citations: [
          {
            page: 10,
            section: "Task Statement 2.3",
            locator: "Knowledge of scoped tool access",
            support: "The guide says too many or out-of-role tools degrade selection reliability."
          },
          {
            page: 30,
            section: "Question 9",
            locator: "Sample question about synthesis agent tool access",
            support: "The sample question covers limited cross-role tools and tool distribution."
          }
        ]
      },
      "q-d2-choice-1": {
        hint: "If the workflow requires a tool result, configure that directly.",
        explain:
          "tool_choice lets you require any tool or force a named tool, which is useful when structured extraction must happen through a schema-backed tool.",
        citations: [
          {
            page: 10,
            section: "Task Statement 2.3",
            locator: "Knowledge of tool_choice configuration",
            support: "The guide lists auto, any, and forced tool selection modes."
          },
          {
            page: 18,
            section: "Task Statement 4.3",
            locator: "Structured output using tool use and JSON schemas",
            support: "The guide connects tool use with schema-constrained structured output."
          }
        ]
      },
      "q-d2-resource-1": {
        hint: "Resources are for reference; tools are for actions.",
        explain:
          "Use MCP resources when Claude needs to discover or read cataloged content. Use tools when Claude must perform an operation.",
        citations: [
          {
            page: 11,
            section: "Task Statement 2.4",
            locator: "MCP resources and integration",
            support: "The guide covers integrating MCP servers and using resources for backend/system content."
          }
        ]
      },
      "q-d3-rules-1": {
        hint: "Make conventions conditional on the files being touched.",
        explain:
          "Path-scoped rules keep API conventions out of test-only work and test conventions out of unrelated source files.",
        citations: [
          {
            page: 14,
            section: "Task Statement 3.3",
            locator: "Path-specific rules",
            support: "The guide covers .claude/rules with YAML frontmatter glob patterns."
          }
        ]
      },
      "q-d3-skill-1": {
        hint: "A repeated workflow should be packaged, not pasted.",
        explain:
          "Skills make workflows repeatable. Forked context and tool restrictions keep the workflow contained.",
        citations: [
          {
            page: 13,
            section: "Task Statement 3.2",
            locator: "Custom slash commands and skills",
            support: "The guide covers skills, context: fork, allowed-tools, and argument-hint frontmatter."
          }
        ]
      },
      "q-d3-plan-1": {
        hint: "Use plan mode when design choices matter.",
        explain:
          "Plan mode pays off for architecture, multi-file work, migrations, and situations with more than one viable path.",
        citations: [
          {
            page: 14,
            section: "Task Statement 3.4",
            locator: "Plan mode versus direct execution",
            support: "The guide asks candidates to determine when plan mode is appropriate based on task complexity."
          }
        ]
      },
      "q-d3-cli-1": {
        hint: "CI needs non-interactive output and exit.",
        explain:
          "The -p / --print mode processes the prompt, prints the result, and exits without waiting in an interactive session.",
        citations: [
          {
            page: 31,
            section: "Question 10",
            locator: "Sample question about Claude Code in CI",
            support: "The sample question identifies -p / --print as the documented non-interactive mode."
          },
          {
            page: 16,
            section: "Task Statement 3.6",
            locator: "Claude Code CI/CD integration",
            support: "The guide covers running Claude Code in automated pipelines."
          }
        ]
      },
      "q-d3-output-1": {
        hint: "Machines should not parse vibes.",
        explain:
          "CI systems need predictable fields and schemas. Structured JSON output is safer than prose when downstream steps depend on the result.",
        citations: [
          {
            page: 16,
            section: "Task Statement 3.6",
            locator: "CI/CD output formats",
            support: "The guide covers --output-format json and --json-schema for automated workflows."
          }
        ]
      },
      "q-d4-schema-1": {
        hint: "Give the model a legal way to say absent.",
        explain:
          "Nullable fields reduce fabrication because the schema can represent missing information directly.",
        citations: [
          {
            page: 18,
            section: "Task Statement 4.3",
            locator: "JSON schema design",
            support: "The guide covers nullable fields and required versus optional schema design."
          }
        ]
      },
      "q-d4-validation-1": {
        hint: "The repair prompt needs the exact failed constraint.",
        explain:
          "Validation-retry loops work when the model sees the source, its failed attempt, and the concrete validation error.",
        citations: [
          {
            page: 19,
            section: "Task Statement 4.4",
            locator: "Validation, retry, and feedback loops",
            support: "The guide describes sending validation errors back for targeted correction."
          }
        ]
      },
      "q-d4-fewshot-1": {
        hint: "Show the boundary cases, not just the happy path.",
        explain:
          "Few-shot examples and explicit criteria calibrate what should count as a finding and what should be skipped.",
        citations: [
          {
            page: 17,
            section: "Task Statement 4.1",
            locator: "Explicit criteria for precision",
            support: "The guide links explicit criteria to reduced false positives."
          },
          {
            page: 17,
            section: "Task Statement 4.2",
            locator: "Few-shot prompting",
            support: "The guide covers targeted examples for ambiguous scenarios and output consistency."
          }
        ]
      },
      "q-d4-batch-1": {
        hint: "Cost savings are useful only when latency is acceptable.",
        explain:
          "Batch processing fits asynchronous, latency-tolerant work. Blocking pre-merge checks need predictable response time.",
        citations: [
          {
            page: 31,
            section: "Question 11",
            locator: "Sample question about Message Batches",
            support: "The sample question chooses batches for overnight reports, not blocking checks."
          },
          {
            page: 19,
            section: "Task Statement 4.5",
            locator: "Batch processing strategies",
            support: "The guide covers batch appropriateness and SLA constraints."
          }
        ]
      },
      "q-d4-batch-2": {
        hint: "Never depend on returned order for identity.",
        explain:
          "custom_id is the stable join key between submitted batch requests and returned results or failures.",
        citations: [
          {
            page: 19,
            section: "Task Statement 4.5",
            locator: "Batch failure handling",
            support: "The guide covers failure handling by custom_id in batch workflows."
          }
        ]
      },
      "q-d4-tooluse-1": {
        hint: "Schema-backed tool use controls shape better than prose.",
        explain:
          "A tool schema constrains the output structure. You still validate semantics, but you avoid many free-text JSON failures.",
        citations: [
          {
            page: 18,
            section: "Task Statement 4.3",
            locator: "Structured output using tool use and JSON schemas",
            support: "The guide covers enforcing structured output with tool_use and JSON schemas."
          }
        ]
      },
      "q-d5-context-1": {
        hint: "Position inside the prompt can matter.",
        explain:
          "Long context windows do not guarantee equal attention everywhere. Put critical information in prominent, structured positions.",
        citations: [
          {
            page: 21,
            section: "Task Statement 5.1",
            locator: "Lost-in-the-middle and position-aware ordering",
            support: "The guide covers lost-in-the-middle effects and position-aware input ordering."
          }
        ]
      },
      "q-d5-trim-1": {
        hint: "Context should carry signal, not every byte.",
        explain:
          "Raw logs often bury the important facts. Extract concise failure summaries, commands, and relevant error lines.",
        citations: [
          {
            page: 21,
            section: "Task Statement 5.1",
            locator: "Trimming verbose tool output",
            support: "The guide covers trimming verbose tool outputs before they accumulate in context."
          }
        ]
      },
      "q-d5-scratch-1": {
        hint: "Persist the investigation outside the chat.",
        explain:
          "Scratchpad or artifact files create durable state for long work, fresh sessions, and crash recovery.",
        citations: [
          {
            page: 23,
            section: "Task Statement 5.4",
            locator: "Large codebase exploration",
            support: "The guide covers scratchpad files and structured state during large codebase exploration."
          }
        ]
      },
      "q-d5-escalation-1": {
        hint: "Respect user preference and unresolved risk.",
        explain:
          "A good escalation includes the context a human needs: issue, evidence, attempted actions, and recommended next step.",
        citations: [
          {
            page: 21,
            section: "Task Statement 5.2",
            locator: "Escalation and ambiguity resolution",
            support: "The guide covers escalation criteria, customer preferences, and policy gap handling."
          }
        ]
      },
      "q-d5-provenance-1": {
        hint: "Do not collapse disagreement into false certainty.",
        explain:
          "Synthesis should preserve conflicting values, sources, dates, and uncertainty rather than inventing a single unsupported truth.",
        citations: [
          {
            page: 24,
            section: "Task Statement 5.6",
            locator: "Information provenance and uncertainty",
            support: "The guide covers claim-source mappings, temporal data, and conflict annotation."
          }
        ]
      },
      "q-d5-confidence-1": {
        hint: "Confidence is for routing and calibration.",
        explain:
          "Low-confidence fields should be reviewed by humans, then measured by field and document type to improve the workflow.",
        citations: [
          {
            page: 23,
            section: "Task Statement 5.5",
            locator: "Human review workflows and confidence calibration",
            support: "The guide covers confidence-based routing and accuracy segmentation."
          }
        ]
      }
    },
    cards: [
      {
        id: "card-d1-loop-stop",
        domain: "d1",
        front: "What two stop_reason values matter most in a basic Claude tool loop?",
        back:
          "Continue the loop on tool_use after executing requested tools and returning results. Stop and answer the user on end_turn.",
        tags: ["agent loop", "tools"]
      },
      {
        id: "card-d1-tool-results",
        domain: "d1",
        front: "Why must tool results be appended to conversation history?",
        back:
          "Claude needs the actual results in context to decide the next action. Without them, the model cannot reason from the tool outcome.",
        tags: ["agent loop", "state"]
      },
      {
        id: "card-d1-bad-stop",
        domain: "d1",
        front: "What is the exam-guide anti-pattern for ending an agent loop?",
        back:
          "Do not parse assistant prose or rely on arbitrary iteration caps as the main completion signal. Use structured stop_reason behavior.",
        tags: ["anti-pattern"]
      },
      {
        id: "card-d1-hub",
        domain: "d1",
        front: "What is the hub-and-spoke multi-agent pattern?",
        back:
          "A coordinator handles decomposition, delegation, routing, error handling, and aggregation while subagents work in isolated contexts.",
        tags: ["multi-agent"]
      },
      {
        id: "card-d1-subagent-context",
        domain: "d1",
        front: "Do subagents automatically inherit the coordinator's conversation?",
        back:
          "No. Relevant findings and constraints must be explicitly included in the subagent prompt or structured handoff.",
        tags: ["context"]
      },
      {
        id: "card-d1-task-tool",
        domain: "d1",
        front: "What must a coordinator have before it can spawn subagents?",
        back:
          "Its allowed tools must include the Task tool, and the coordinator prompt should describe goals and quality criteria.",
        tags: ["Task tool"]
      },
      {
        id: "card-d1-parallel-task",
        domain: "d1",
        front: "How should a coordinator spawn parallel subagents?",
        back:
          "Emit multiple Task tool calls in the same response turn when the work can proceed independently.",
        tags: ["parallel"]
      },
      {
        id: "card-d1-gates",
        domain: "d1",
        front: "When should programmatic gates beat prompt instructions?",
        back:
          "When compliance must be deterministic, such as identity verification before financial operations or policy limits before refunds.",
        tags: ["hooks", "compliance"]
      },
      {
        id: "card-d1-hooks",
        domain: "d1",
        front: "What can Agent SDK hooks do in a production workflow?",
        back:
          "They can normalize tool results before the model sees them or intercept/block outgoing tool calls that violate policy.",
        tags: ["hooks"]
      },
      {
        id: "card-d1-decomp",
        domain: "d1",
        front: "When is prompt chaining a good decomposition strategy?",
        back:
          "Use it for predictable multi-step workflows, such as per-file review followed by cross-file integration review.",
        tags: ["decomposition"]
      },
      {
        id: "card-d1-adaptive",
        domain: "d1",
        front: "When is dynamic adaptive decomposition a better fit?",
        back:
          "Use it for open-ended investigations where the next subtask depends on discoveries made during earlier analysis.",
        tags: ["decomposition"]
      },
      {
        id: "card-d1-resume",
        domain: "d1",
        front: "When is a fresh session with a summary better than resuming an old session?",
        back:
          "When previous tool results may be stale. A structured summary avoids carrying obsolete observations forward.",
        tags: ["sessions"]
      },
      {
        id: "card-d2-description",
        domain: "d2",
        front: "Why are tool descriptions so important?",
        back:
          "Descriptions are the model's main signal for choosing tools. Vague or overlapping descriptions cause misrouting.",
        tags: ["MCP", "tools"]
      },
      {
        id: "card-d2-boundaries",
        domain: "d2",
        front: "What should a strong tool description include?",
        back:
          "Purpose, expected inputs, output shape, examples, edge cases, and when to use it instead of similar tools.",
        tags: ["tools"]
      },
      {
        id: "card-d2-split",
        domain: "d2",
        front: "When should a generic tool be split into several tools?",
        back:
          "When one broad tool hides distinct intents. Separate tools with clear contracts improve selection reliability.",
        tags: ["tool design"]
      },
      {
        id: "card-d2-errors",
        domain: "d2",
        front: "What metadata should structured MCP errors include?",
        back:
          "Use isError plus category, retryability, and a human-readable explanation so the agent can recover correctly.",
        tags: ["errors"]
      },
      {
        id: "card-d2-empty",
        domain: "d2",
        front: "Why distinguish an access failure from a valid empty result?",
        back:
          "An access failure may need retry or escalation. An empty result can be a successful query with no matches.",
        tags: ["errors"]
      },
      {
        id: "card-d2-tool-sprawl",
        domain: "d2",
        front: "What happens when an agent gets too many tools?",
        back:
          "Tool selection gets less reliable because the model has more similar options and a larger decision surface.",
        tags: ["tools"]
      },
      {
        id: "card-d2-tool-choice",
        domain: "d2",
        front: "What are the common tool_choice modes?",
        back:
          "auto lets the model decide, any forces at least one tool, and forced selection names a specific tool.",
        tags: ["tool_choice"]
      },
      {
        id: "card-d2-resources",
        domain: "d2",
        front: "When should MCP resources be used instead of tools?",
        back:
          "Use resources for discoverable content catalogs or reference material. Use tools for actions and dynamic operations.",
        tags: ["MCP"]
      },
      {
        id: "card-d2-scope",
        domain: "d2",
        front: "What is the project vs user scope tradeoff for MCP servers?",
        back:
          "Project-scoped servers support shared team workflows. User-scoped servers are better for personal or experimental tools.",
        tags: ["MCP"]
      },
      {
        id: "card-d3-hierarchy",
        domain: "d3",
        front: "What is the core idea behind CLAUDE.md hierarchy?",
        back:
          "Use persistent instructions at the appropriate scope: user-wide, project-wide, or directory-specific.",
        tags: ["Claude Code"]
      },
      {
        id: "card-d3-rules",
        domain: "d3",
        front: "Why use .claude/rules with path frontmatter?",
        back:
          "Rules load only for matching files, keeping context focused and reducing conflicts between unrelated conventions.",
        tags: ["rules"]
      },
      {
        id: "card-d3-skills",
        domain: "d3",
        front: "Why put repeated workflows into skills?",
        back:
          "Skills package task-specific instructions, tool limits, and optional forked context so workflows are repeatable.",
        tags: ["skills"]
      },
      {
        id: "card-d3-fork",
        domain: "d3",
        front: "Why is context: fork useful for a skill?",
        back:
          "The skill can run in isolation without polluting the main conversation with task-specific reasoning or tool output.",
        tags: ["skills"]
      },
      {
        id: "card-d3-plan",
        domain: "d3",
        front: "When is plan mode worth using?",
        back:
          "Use it when architecture, multiple files, risky changes, or several valid approaches require explicit planning.",
        tags: ["plan mode"]
      },
      {
        id: "card-d3-direct",
        domain: "d3",
        front: "When is direct execution usually enough?",
        back:
          "Use it for simple, localized, low-risk changes where a planning round adds little value.",
        tags: ["plan mode"]
      },
      {
        id: "card-d3-print",
        domain: "d3",
        front: "Which Claude Code CLI flag makes CI-style non-interactive runs possible?",
        back:
          "Use -p or --print so the prompt is processed, output is printed, and the command exits.",
        tags: ["CLI", "CI"]
      },
      {
        id: "card-d3-json",
        domain: "d3",
        front: "Why use --output-format json or --json-schema in CI?",
        back:
          "Structured output gives downstream automation predictable fields instead of fragile prose parsing.",
        tags: ["CI"]
      },
      {
        id: "card-d4-criteria",
        domain: "d4",
        front: "How do explicit criteria improve code review prompts?",
        back:
          "They define what counts as a finding and reduce false positives caused by vague review instructions.",
        tags: ["prompts"]
      },
      {
        id: "card-d4-fewshot",
        domain: "d4",
        front: "What are few-shot examples best for?",
        back:
          "They calibrate format and ambiguous cases, such as what severity to assign or how to handle unusual documents.",
        tags: ["few-shot"]
      },
      {
        id: "card-d4-tooluse",
        domain: "d4",
        front: "Why prefer tool_use with JSON schema for structured output?",
        back:
          "The schema constrains syntax and shape more reliably than asking the model to write JSON in free text.",
        tags: ["structured output"]
      },
      {
        id: "card-d4-nullable",
        domain: "d4",
        front: "Why include nullable fields in extraction schemas?",
        back:
          "They let the model represent absent information as null instead of fabricating a value.",
        tags: ["schemas"]
      },
      {
        id: "card-d4-validation",
        domain: "d4",
        front: "What should a validation retry include?",
        back:
          "Include the source, the failed output, and the specific validation error so the model can make a targeted correction.",
        tags: ["validation"]
      },
      {
        id: "card-d4-batches",
        domain: "d4",
        front: "When are Message Batches a good fit?",
        back:
          "Use them for latency-tolerant work such as overnight reports. Avoid them for blocking workflows with tight deadlines.",
        tags: ["batches"]
      },
      {
        id: "card-d4-custom-id",
        domain: "d4",
        front: "Why use custom_id with batch requests?",
        back:
          "It lets you correlate returned results and failures with the original inputs regardless of response ordering.",
        tags: ["batches"]
      },
      {
        id: "card-d5-lost",
        domain: "d5",
        front: "What is the lost-in-the-middle risk?",
        back:
          "Important content buried in the middle of a long context can receive less attention than beginning or ending content.",
        tags: ["context"]
      },
      {
        id: "card-d5-ordering",
        domain: "d5",
        front: "How can input ordering help context reliability?",
        back:
          "Put key facts and instructions where the model is likely to attend to them, and keep handoffs structured.",
        tags: ["context"]
      },
      {
        id: "card-d5-trim",
        domain: "d5",
        front: "Why trim verbose tool output before accumulating context?",
        back:
          "It preserves token budget and avoids drowning important facts in raw logs or low-value noise.",
        tags: ["context"]
      },
      {
        id: "card-d5-scratchpad",
        domain: "d5",
        front: "What problem do scratchpad files solve?",
        back:
          "They persist findings outside conversation history, supporting long work, crash recovery, and clean handoffs.",
        tags: ["state"]
      },
      {
        id: "card-d5-escalate",
        domain: "d5",
        front: "When should an agent escalate to a human?",
        back:
          "Escalate on policy gaps, user requests for human help, irreversible risk, missing authority, or inability to progress.",
        tags: ["escalation"]
      },
      {
        id: "card-d5-confidence",
        domain: "d5",
        front: "Why use confidence scores in extraction workflows?",
        back:
          "They support calibrated human review routing and help measure accuracy by field or document type.",
        tags: ["confidence"]
      },
      {
        id: "card-d5-provenance",
        domain: "d5",
        front: "What should source provenance preserve?",
        back:
          "Keep claim-to-source mappings, dates, document names, excerpts, and uncertainty or conflict notes.",
        tags: ["provenance"]
      }
    ],
    questions: [
      {
        id: "q-d1-loop-1",
        domain: "d1",
        scenario: "s1",
        prompt:
          "A support agent calls lookup_order and receives a result. What should the loop do next?",
        choices: [
          "Append the tool result to the conversation and ask Claude for the next action.",
          "Stop immediately because any tool call means the task is complete.",
          "Parse the assistant text for the phrase final answer.",
          "Discard the tool result and call the next tool in a fixed sequence."
        ],
        answer: 0,
        explanation:
          "Tool results must be fed back into the conversation so the model can reason about what happened."
      },
      {
        id: "q-d1-loop-2",
        domain: "d1",
        scenario: "s4",
        prompt:
          "A developer productivity agent should stop after which structured signal?",
        choices: [
          "The model returns stop_reason end_turn.",
          "The assistant says it is done.",
          "Three iterations have elapsed.",
          "The response contains no code block."
        ],
        answer: 0,
        explanation:
          "The exam emphasizes structured control flow using stop_reason rather than natural-language completion signals."
      },
      {
        id: "q-d1-subagent-1",
        domain: "d1",
        scenario: "s3",
        prompt:
          "A synthesis subagent misses key facts found by the search subagent. What is the likely design flaw?",
        choices: [
          "The coordinator did not explicitly pass the search findings into the synthesis prompt.",
          "The synthesis subagent needed more unrelated tools.",
          "The search subagent should have written prose instead of structured findings.",
          "The coordinator should have hidden source metadata to save tokens."
        ],
        answer: 0,
        explanation:
          "Subagents do not inherit context automatically. Findings must be passed explicitly."
      },
      {
        id: "q-d1-parallel-1",
        domain: "d1",
        scenario: "s3",
        prompt:
          "How should a coordinator launch independent web-search and document-analysis subagents most efficiently?",
        choices: [
          "Emit both Task tool calls in the same response.",
          "Ask one subagent to secretly call the other.",
          "Run the full pipeline for every query even when unnecessary.",
          "Put all tools on one large synthesis agent."
        ],
        answer: 0,
        explanation:
          "Multiple Task calls in one turn enable parallel work when tasks are independent."
      },
      {
        id: "q-d1-gate-1",
        domain: "d1",
        scenario: "s1",
        prompt:
          "Refunds above a threshold must always escalate. What is the strongest control?",
        choices: [
          "Intercept the tool call with a hook or gate that blocks policy-violating refunds.",
          "Tell the model politely not to issue large refunds.",
          "Review refunds manually after they have already been processed.",
          "Use a bigger context window."
        ],
        answer: 0,
        explanation:
          "Business rules that require guaranteed compliance should be enforced programmatically."
      },
      {
        id: "q-d1-decomp-1",
        domain: "d1",
        scenario: "s5",
        prompt:
          "A large PR review is shallow and inconsistent when analyzed in one pass. What is the best redesign?",
        choices: [
          "Analyze files in focused passes, then run a separate cross-file integration pass.",
          "Only review the files with the most changed lines.",
          "Ask for a shorter answer.",
          "Run the same full review three times and ignore unique findings."
        ],
        answer: 0,
        explanation:
          "Prompt chaining into focused passes reduces attention dilution and preserves integration review."
      },
      {
        id: "q-d1-resume-1",
        domain: "d1",
        scenario: "s4",
        prompt:
          "A resumed session contains stale file observations after the repo changed. What is safer?",
        choices: [
          "Start fresh with a structured summary of current facts and changed files.",
          "Trust the previous tool output.",
          "Ask the model to remember harder.",
          "Remove all file references from the task."
        ],
        answer: 0,
        explanation:
          "Fresh sessions with summaries avoid carrying stale tool results into new work."
      },
      {
        id: "q-d2-desc-1",
        domain: "d2",
        scenario: "s1",
        prompt:
          "Two MCP tools have nearly identical descriptions. The agent often chooses the wrong one. What should you do first?",
        choices: [
          "Rewrite names and descriptions to clarify purpose, input shape, outputs, and boundaries.",
          "Add more tools so one will be right.",
          "Force the model to never use either tool.",
          "Move the ambiguity into the system prompt."
        ],
        answer: 0,
        explanation:
          "Tool descriptions drive selection, so overlapping descriptions must be made distinct."
      },
      {
        id: "q-d2-error-1",
        domain: "d2",
        scenario: "s1",
        prompt:
          "A payment API timeout occurs. Which MCP error shape is most useful?",
        choices: [
          "isError with category transient, isRetryable true, and a clear explanation.",
          "A generic string that says operation failed.",
          "A success response with no data.",
          "A hidden console log only."
        ],
        answer: 0,
        explanation:
          "Structured error metadata helps the agent decide whether to retry, explain, or escalate."
      },
      {
        id: "q-d2-empty-1",
        domain: "d2",
        scenario: "s3",
        prompt:
          "A source search succeeds but finds no matching documents. How should the tool report this?",
        choices: [
          "As a successful empty result, not an error.",
          "As a retryable permission error.",
          "As a fatal system failure.",
          "By omitting the result entirely."
        ],
        answer: 0,
        explanation:
          "A valid empty result means the query worked. It should not trigger error recovery."
      },
      {
        id: "q-d2-tools-1",
        domain: "d2",
        scenario: "s3",
        prompt:
          "A synthesis subagent keeps making unnecessary web searches. What is the best fix?",
        choices: [
          "Remove web-search tools from the synthesis agent and pass findings to it explicitly.",
          "Give it more search tools.",
          "Force every subagent to share one giant tool list.",
          "Hide all source metadata."
        ],
        answer: 0,
        explanation:
          "Agents should have tools scoped to their role. Synthesis should synthesize supplied evidence."
      },
      {
        id: "q-d2-choice-1",
        domain: "d2",
        scenario: "s6",
        prompt:
          "You need a structured extraction result and do not want a prose-only response. Which tool_choice fits best?",
        choices: [
          "Force the extraction tool or require any tool use, depending on whether only one tool is valid.",
          "Use no tools and ask for JSON in prose.",
          "Disable schemas.",
          "Let the model pick from many unrelated tools."
        ],
        answer: 0,
        explanation:
          "Forced or required tool use is appropriate when the workflow requires a structured tool result."
      },
      {
        id: "q-d2-resource-1",
        domain: "d2",
        scenario: "s4",
        prompt:
          "You want Claude to browse a catalog of project documentation without performing an action. What MCP concept fits?",
        choices: [
          "A resource.",
          "A destructive tool.",
          "A forced Bash command.",
          "A validation error."
        ],
        answer: 0,
        explanation:
          "Resources are appropriate for content catalogs and reference material."
      },
      {
        id: "q-d3-rules-1",
        domain: "d3",
        scenario: "s2",
        prompt:
          "API files and test files need different conventions. What Claude Code configuration is best?",
        choices: [
          "Path-scoped .claude/rules files with YAML frontmatter globs.",
          "One giant unscoped instruction containing every convention.",
          "A README that Claude never sees.",
          "A custom MCP tool for every style rule."
        ],
        answer: 0,
        explanation:
          "Path-scoped rules keep instructions relevant to the files being edited."
      },
      {
        id: "q-d3-skill-1",
        domain: "d3",
        scenario: "s2",
        prompt:
          "A repeated audit workflow should run without polluting the main conversation. What should you use?",
        choices: [
          "A skill with forked context and restricted tools.",
          "A long ad hoc prompt pasted every time.",
          "A user-scoped secret.",
          "A batch API call with no tool use."
        ],
        answer: 0,
        explanation:
          "Skills package repeatable workflows, and forked context isolates the run."
      },
      {
        id: "q-d3-plan-1",
        domain: "d3",
        scenario: "s2",
        prompt:
          "Which task most benefits from plan mode?",
        choices: [
          "A multi-file migration with several valid approaches.",
          "Fixing one typo in a comment.",
          "Renaming a local variable in one function.",
          "Formatting one JSON file."
        ],
        answer: 0,
        explanation:
          "Plan mode is valuable when architecture, risk, or multiple files require explicit sequencing."
      },
      {
        id: "q-d3-cli-1",
        domain: "d3",
        scenario: "s5",
        prompt:
          "Claude Code hangs in CI because it waits for interactive input. Which flag should be used?",
        choices: ["-p or --print", "--batch", "CLAUDE_HEADLESS=true", "--interactive=false"],
        answer: 0,
        explanation:
          "The exam guide identifies -p / --print as the non-interactive CLI mode."
      },
      {
        id: "q-d3-output-1",
        domain: "d3",
        scenario: "s5",
        prompt:
          "A CI job needs machine-readable review findings. What should the Claude Code invocation request?",
        choices: [
          "Structured JSON output, optionally constrained by a JSON schema.",
          "A friendly paragraph with bullets.",
          "A screenshot of the terminal.",
          "A hidden scratchpad only."
        ],
        answer: 0,
        explanation:
          "CI automation should consume structured output instead of parsing prose."
      },
      {
        id: "q-d4-schema-1",
        domain: "d4",
        scenario: "s6",
        prompt:
          "A field may not exist in a source document. How should the schema represent that?",
        choices: [
          "Allow null for that field.",
          "Make the model guess the nearest value.",
          "Make the entire extraction fail.",
          "Remove the field from the schema forever."
        ],
        answer: 0,
        explanation:
          "Nullable fields reduce hallucination by giving the model a valid absent-information value."
      },
      {
        id: "q-d4-validation-1",
        domain: "d4",
        scenario: "s6",
        prompt:
          "A Pydantic validation retry is needed. What should the retry prompt include?",
        choices: [
          "The source, failed output, and exact validation error.",
          "Only the original system prompt.",
          "A vague note saying try again.",
          "No schema, to give the model freedom."
        ],
        answer: 0,
        explanation:
          "Specific validation feedback enables targeted repair."
      },
      {
        id: "q-d4-fewshot-1",
        domain: "d4",
        scenario: "s5",
        prompt:
          "Automated review flags too many low-value issues. Which prompt change best addresses this?",
        choices: [
          "Add explicit criteria plus examples of what to report and skip.",
          "Ask for a stricter tone.",
          "Increase max_tokens.",
          "Remove all examples."
        ],
        answer: 0,
        explanation:
          "Explicit criteria and calibrated examples reduce false positives."
      },
      {
        id: "q-d4-batch-1",
        domain: "d4",
        scenario: "s5",
        prompt:
          "Which workflow is best suited to Message Batches?",
        choices: [
          "An overnight technical-debt report.",
          "A blocking pre-merge check developers wait on.",
          "A live support refund decision.",
          "A multi-turn tool-calling conversation."
        ],
        answer: 0,
        explanation:
          "Batches trade latency for lower cost and fit asynchronous work."
      },
      {
        id: "q-d4-batch-2",
        domain: "d4",
        scenario: "s6",
        prompt:
          "Batch responses arrive in a different order than submitted inputs. What prevents confusion?",
        choices: [
          "Use custom_id values to correlate requests and responses.",
          "Assume the order is always identical.",
          "Sort by response length.",
          "Drop failed documents."
        ],
        answer: 0,
        explanation:
          "custom_id is the reliable correlation key for batch processing."
      },
      {
        id: "q-d4-tooluse-1",
        domain: "d4",
        scenario: "s6",
        prompt:
          "Why use tool_use for JSON extraction instead of plain text JSON?",
        choices: [
          "It constrains output shape with a schema.",
          "It removes the need for validation.",
          "It guarantees field accuracy without examples.",
          "It is only useful for CI jobs."
        ],
        answer: 0,
        explanation:
          "Schema-constrained tool use improves syntactic and structural reliability."
      },
      {
        id: "q-d5-context-1",
        domain: "d5",
        scenario: "s3",
        prompt:
          "A long research context buries the most important constraints in the middle. What risk is this?",
        choices: [
          "Lost-in-the-middle attention degradation.",
          "A permission error.",
          "A failed custom_id.",
          "A tool_choice conflict."
        ],
        answer: 0,
        explanation:
          "Important facts buried in the middle of long inputs may receive less attention."
      },
      {
        id: "q-d5-trim-1",
        domain: "d5",
        scenario: "s5",
        prompt:
          "A review prompt includes thousands of lines of raw build logs. What should the system do?",
        choices: [
          "Extract and pass concise relevant facts instead of raw noise.",
          "Always include the entire log.",
          "Hide build failures from the reviewer.",
          "Delete source provenance."
        ],
        answer: 0,
        explanation:
          "Context quality matters. Verbose low-value output should be trimmed or summarized."
      },
      {
        id: "q-d5-scratch-1",
        domain: "d5",
        scenario: "s4",
        prompt:
          "A long codebase investigation must survive crashes and fresh sessions. What pattern helps?",
        choices: [
          "Persist structured findings in scratchpad or artifact files.",
          "Keep everything only in conversation history.",
          "Rely on the model remembering previous terminal output.",
          "Avoid writing summaries."
        ],
        answer: 0,
        explanation:
          "Structured external state supports reliability across context boundaries."
      },
      {
        id: "q-d5-escalation-1",
        domain: "d5",
        scenario: "s1",
        prompt:
          "A customer explicitly asks for a human after an unresolved billing dispute. What should the agent do?",
        choices: [
          "Escalate with a structured handoff summary.",
          "Continue autonomously no matter what.",
          "Issue the maximum refund without verification.",
          "Erase the conversation transcript."
        ],
        answer: 0,
        explanation:
          "User preference and unresolved policy-sensitive issues are valid escalation triggers."
      },
      {
        id: "q-d5-provenance-1",
        domain: "d5",
        scenario: "s3",
        prompt:
          "Two credible sources disagree on a statistic. What should synthesis do?",
        choices: [
          "Preserve both values with source attribution and mark the conflict.",
          "Choose the larger number.",
          "Remove all citations.",
          "Pretend the sources agree."
        ],
        answer: 0,
        explanation:
          "Reliable synthesis preserves provenance and communicates conflicts or uncertainty."
      },
      {
        id: "q-d5-confidence-1",
        domain: "d5",
        scenario: "s6",
        prompt:
          "How should low-confidence extracted fields be handled?",
        choices: [
          "Route them to human review and track accuracy by field/document type.",
          "Accept them silently.",
          "Delete the whole document.",
          "Increase temperature."
        ],
        answer: 0,
        explanation:
          "Confidence scores support review routing and calibration."
      }
    ]
  }
];
