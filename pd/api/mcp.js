import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { join, resolve } from 'node:path';
import { loadPromptCache, buildServer } from '../server/skills.js';

const SKILLS_DIR = resolve(join(process.cwd(), 'skills'));
const promptCache = loadPromptCache(SKILLS_DIR);

export default async function handler(req, res) {
  const server = buildServer(promptCache);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  await transport.handleRequest(req, res);

  res.on('close', () => {
    server.close().catch(() => {});
  });
}
