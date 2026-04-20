import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SKILLS_DIR = resolve(process.env.PD_SKILLS_DIR ?? join(process.cwd(), 'skills'));

const skills = [
  { dir: 'setup', name: 'pd-setup', desc: 'Configure product design environment' },
  { dir: 'product-spec', name: 'pd-product-spec', desc: 'Create a product design spec' },
  { dir: 'feature-spec', name: 'pd-feature-spec', desc: 'Create a feature design spec' },
  { dir: 'bug-report', name: 'pd-bug-report', desc: 'Write a structured bug report' },
];

function loadSkillText(skillDir) {
  const base = join(SKILLS_DIR, skillDir);
  let text = readFileSync(join(base, 'SKILL.md'), 'utf-8');
  try {
    for (const f of readdirSync(join(base, 'templates')).filter(f => f.endsWith('.md'))) {
      text += `\n\n---\n\n# Template: ${f}\n\n` + readFileSync(join(base, 'templates', f), 'utf-8');
    }
  } catch { /* no templates */ }
  return text;
}

const cache = new Map();
for (const s of skills) cache.set(s.name, { ...s, text: loadSkillText(s.dir) });

// MCP protocol constants
const SERVER_INFO = { name: 'pd-prompt-server', version: '0.1.0' };
const PROTOCOL_VERSION = '2025-06-18';

function handleRpc(method, params) {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {}, prompts: {} },
        serverInfo: SERVER_INFO,
      };

    case 'notifications/initialized':
      return undefined; // no response for notifications

    case 'tools/list':
      return {
        tools: skills.map(s => ({
          name: s.name,
          description: `Load the ${s.desc.toLowerCase()} skill. Call this tool, then follow the instructions it returns.`,
          inputSchema: { type: 'object', properties: {} },
        })),
      };

    case 'tools/call': {
      const entry = cache.get(params?.name);
      if (!entry) return { content: [{ type: 'text', text: `Unknown tool: ${params?.name}` }], isError: true };
      return { content: [{ type: 'text', text: entry.text }] };
    }

    case 'prompts/list':
      return {
        prompts: skills.map(s => ({ name: s.name, description: s.desc })),
      };

    case 'prompts/get': {
      const entry = cache.get(params?.name);
      if (!entry) throw { code: -32602, message: `Unknown prompt: ${params?.name}` };
      return {
        messages: [{ role: 'user', content: { type: 'text', text: entry.text } }],
      };
    }

    default:
      throw { code: -32601, message: `Method not found: ${method}` };
  }
}

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    res.writeHead(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }

  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const { method, params, id } = body;

      const result = handleRpc(method, params);

      if (result === undefined) {
        // notification — no response body
        res.writeHead(202).end();
        return;
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', result, id }));
    } catch (err) {
      const code = err.code ?? -32603;
      const message = err.message ?? 'Internal error';
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }));
    }
  });
}
