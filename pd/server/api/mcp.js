import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SKILLS_DIR = resolve(process.env.PD_SKILLS_DIR ?? join(process.cwd(), 'skills'));

const skills = [
  { dir: 'setup', name: 'pd-setup', desc: 'Configure product design environment' },
  { dir: 'product-spec', name: 'pd-product-spec', desc: 'Create a product design spec' },
  { dir: 'feature-spec', name: 'pd-feature-spec', desc: 'Create a feature design spec' },
  { dir: 'bug-report', name: 'pd-bug-report', desc: 'Write a structured bug report' },
];

function loadSkillPrompt(skillDir) {
  const base = join(SKILLS_DIR, skillDir);
  const skillText = readFileSync(join(base, 'SKILL.md'), 'utf-8');
  const templatesDir = join(base, 'templates');
  let templates = '';
  try {
    for (const file of readdirSync(templatesDir).filter(f => f.endsWith('.md'))) {
      templates += `\n\n---\n\n# Template: ${file}\n\n` + readFileSync(join(templatesDir, file), 'utf-8');
    }
  } catch { /* no templates */ }
  return skillText + templates;
}

// Cache prompts at module scope (survives across warm invocations via Fluid Compute)
const promptCache = new Map();
for (const skill of skills) {
  promptCache.set(skill.dir, loadSkillPrompt(skill.dir));
}

function buildServer() {
  const server = new McpServer(
    { name: 'pd-prompt-server', version: '0.1.0' },
    { capabilities: { prompts: {}, tools: {} } },
  );
  for (const skill of skills) {
    const text = promptCache.get(skill.dir);
    server.prompt(skill.name, skill.desc, () => ({
      messages: [{ role: 'user', content: { type: 'text', text } }],
    }));
    server.tool(
      skill.name,
      `Load the ${skill.desc.toLowerCase()} skill. Call this tool, then follow the instructions it returns.`,
      {},
      () => ({ content: [{ type: 'text', text }] }),
    );
  }
  return server;
}

// Stateless: each request gets a fresh server+transport pair.
// No session persistence needed — prompts are static content.
export default async function handler(req, res) {
  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });

  await server.connect(transport);

  // Convert Vercel's Node req/res into what the SDK expects
  await transport.handleRequest(req, res);

  // Clean up after response is sent
  res.on('close', () => {
    server.close().catch(() => {});
  });
}
