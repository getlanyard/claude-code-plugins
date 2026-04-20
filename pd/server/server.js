import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from 'node:http';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SKILLS_DIR = resolve(process.env.PD_SKILLS_DIR ?? join(import.meta.dirname, '..', 'skills'));
const PORT = parseInt(process.env.PORT ?? '8080', 10);
const HOST = process.env.HOST ?? '0.0.0.0';

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
    const files = readdirSync(templatesDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      templates += `\n\n---\n\n# Template: ${file}\n\n` + readFileSync(join(templatesDir, file), 'utf-8');
    }
  } catch {
    // no templates dir — that's fine
  }

  return skillText + templates;
}

// Validate all skills load at startup
const promptCache = new Map();
for (const skill of skills) {
  try {
    promptCache.set(skill.dir, loadSkillPrompt(skill.dir));
  } catch (err) {
    console.error(`failed to load skill "${skill.dir}": ${err.message}`);
    process.exit(1);
  }
}
console.log(`loaded ${promptCache.size} skills from ${SKILLS_DIR}`);

function buildServer() {
  const server = new McpServer(
    { name: 'pd-prompt-server', version: '0.1.0' },
    { capabilities: { prompts: {}, tools: {} } },
  );

  for (const skill of skills) {
    const text = promptCache.get(skill.dir);

    // Register as prompts (for clients that support MCP prompts)
    server.prompt(skill.name, skill.desc, () => ({
      messages: [{ role: 'user', content: { type: 'text', text } }],
    }));

    // Register as tools (for clients like claude.ai that only surface tools)
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
// This avoids "no valid session" errors when clients don't track session IDs.

const http = createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }

  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });

  await server.connect(transport);
  await transport.handleRequest(req, res);

  res.on('close', () => {
    server.close().catch(() => {});
  });
});

http.listen(PORT, HOST, () => {
  console.log(`pd-prompt-server listening on http://${HOST}:${PORT}/mcp`);
});

process.on('SIGINT', () => { http.close(); process.exit(0); });
process.on('SIGTERM', () => { http.close(); process.exit(0); });
