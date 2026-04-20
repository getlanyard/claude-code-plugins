import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
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
    { capabilities: { prompts: {} } },
  );

  for (const skill of skills) {
    const text = promptCache.get(skill.dir);
    server.prompt(skill.name, skill.desc, () => ({
      messages: [{ role: 'user', content: { type: 'text', text } }],
    }));
  }

  return server;
}

// Per-session transport map (same pattern as mcp-sdd-server)
const sessions = new Map();

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function isInitialize(body) {
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body;
    if (Array.isArray(parsed)) return parsed.some(m => m.method === 'initialize');
    return parsed.method === 'initialize';
  } catch { return false; }
}

function jsonRpcError(res, code, message) {
  res.writeHead(400, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }));
}

const http = createServer(async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];

  if (req.method === 'POST') {
    const raw = await readBody(req);
    const body = raw ? JSON.parse(raw) : undefined;

    if (sessionId && sessions.has(sessionId)) {
      await sessions.get(sessionId).transport.handleRequest(req, res, body);
    } else if (!sessionId && isInitialize(body)) {
      const server = buildServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          sessions.set(id, { server, transport });
          console.log(`session created: ${id} (${sessions.size} active)`);
        },
        onsessionclosed: (id) => {
          sessions.delete(id);
          console.log(`session closed: ${id} (${sessions.size} active)`);
        },
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } else {
      jsonRpcError(res, -32000, 'no valid session');
    }
  } else if (req.method === 'GET' || req.method === 'DELETE') {
    if (sessionId && sessions.has(sessionId)) {
      await sessions.get(sessionId).transport.handleRequest(req, res);
    } else {
      jsonRpcError(res, -32000, 'no valid session');
    }
  } else {
    res.writeHead(405).end();
  }
});

http.listen(PORT, HOST, () => {
  console.log(`pd-prompt-server listening on http://${HOST}:${PORT}/mcp`);
});

process.on('SIGINT', () => { http.close(); process.exit(0); });
process.on('SIGTERM', () => { http.close(); process.exit(0); });
