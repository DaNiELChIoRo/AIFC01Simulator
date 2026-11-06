/**
 * CCA-F Exam Sim — the five content domains of the Claude Certified
 * Architect – Foundations exam.
 *
 * `weight` is each domain's share of the exam as published in Anthropic's
 * exam blueprint. `docs` are the official Anthropic / MCP pages the results
 * screen links to whenever a domain comes in under the readiness line.
 */
window.CCAF_DOMAINS = {
  ag: {
    code: "Domain 1",
    name: "Agentic Architecture & Orchestration",
    icon: "🧭",
    weight: 27,
    blurb: "The agent loop and stop reasons, workflow patterns vs. agents, multi-agent orchestration, delegation, evaluation, and batch processing.",
    docs: [
      { label: "Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents", src: "Anthropic" },
      { label: "How we built our multi-agent research system", url: "https://www.anthropic.com/engineering/multi-agent-research-system", src: "Anthropic" },
      { label: "Stop reasons and fallback", url: "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons", src: "Docs" },
      { label: "Batch processing", url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing", src: "Docs" },
    ],
  },
  cc: {
    code: "Domain 2",
    name: "Claude Code Configuration & Workflows",
    icon: "⌨️",
    weight: 20,
    blurb: "Settings precedence, permission rules and modes, CLAUDE.md memory, hooks, subagents, and Skills.",
    docs: [
      { label: "Claude Code settings", url: "https://code.claude.com/docs/en/settings", src: "Docs" },
      { label: "Permissions", url: "https://code.claude.com/docs/en/permissions", src: "Docs" },
      { label: "Memory (CLAUDE.md)", url: "https://code.claude.com/docs/en/memory", src: "Docs" },
      { label: "Hooks reference", url: "https://code.claude.com/docs/en/hooks", src: "Docs" },
      { label: "Subagents", url: "https://code.claude.com/docs/en/sub-agents", src: "Docs" },
      { label: "Skills", url: "https://code.claude.com/docs/en/skills", src: "Docs" },
    ],
  },
  pe: {
    code: "Domain 3",
    name: "Prompt Engineering & Structured Output",
    icon: "🧩",
    weight: 20,
    blurb: "Structured outputs and strict tools, long-context layout, examples, explaining the why, system-prompt altitude, and evaluating output.",
    docs: [
      { label: "Structured outputs", url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs", src: "Docs" },
      { label: "Prompting best practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices", src: "Docs" },
      { label: "Effective context engineering for AI agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", src: "Anthropic" },
    ],
  },
  tm: {
    code: "Domain 4",
    name: "Tool Design & MCP Integration",
    icon: "🔌",
    weight: 18,
    blurb: "MCP primitives, transports and scopes, tool_choice, tool_result handling, errors, and designing tools agents use well.",
    docs: [
      { label: "Define tools", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools", src: "Docs" },
      { label: "Handle tool calls", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls", src: "Docs" },
      { label: "Writing effective tools for agents", url: "https://www.anthropic.com/engineering/writing-tools-for-agents", src: "Anthropic" },
      { label: "Claude Code MCP", url: "https://code.claude.com/docs/en/mcp", src: "Docs" },
      { label: "MCP server concepts", url: "https://modelcontextprotocol.io/docs/learn/server-concepts", src: "MCP" },
    ],
  },
  cx: {
    code: "Domain 5",
    name: "Context Management & Reliability",
    icon: "🛡️",
    weight: 15,
    blurb: "Context rot and long-horizon techniques, just-in-time retrieval, prompt caching, API errors, and retries.",
    docs: [
      { label: "Effective context engineering for AI agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", src: "Anthropic" },
      { label: "Prompt caching", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching", src: "Docs" },
      { label: "API errors", url: "https://platform.claude.com/docs/en/api/errors", src: "Docs" },
    ],
  },
};
