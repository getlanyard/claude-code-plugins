import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';
import { loadPromptCache, buildServer } from './skills.js';

const SKILLS_DIR = resolve(process.env.PD_SKILLS_DIR ?? join(import.meta.dirname, '..', 'skills'));
const PORT = parseInt(process.env.PORT ?? '8080', 10);
const HOST = process.env.HOST ?? '0.0.0.0';

const promptCache = loadPromptCache(SKILLS_DIR);
console.log(`loaded ${promptCache.size} skills from ${SKILLS_DIR}`);

const http = createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }

  const server = buildServer(promptCache);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
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
