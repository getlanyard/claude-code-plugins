import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const skills = [
  { dir: 'setup', name: 'pd-setup', desc: 'Configure product design environment' },
  { dir: 'product-spec', name: 'pd-product-spec', desc: 'Create a product design spec' },
  { dir: 'feature-spec', name: 'pd-feature-spec', desc: 'Create a feature design spec' },
  { dir: 'bug-report', name: 'pd-bug-report', desc: 'Write a structured bug report' },
];

function loadSkillPrompt(skillsDir, skillDir) {
  const base = join(skillsDir, skillDir);
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

export function loadPromptCache(skillsDir) {
  const cache = new Map();
  for (const skill of skills) {
    cache.set(skill.dir, loadSkillPrompt(skillsDir, skill.dir));
  }
  return cache;
}

export function buildServer(promptCache) {
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
