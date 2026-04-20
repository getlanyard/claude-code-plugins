FROM node:22-slim

WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev

# Copy server code
COPY server/server.js ./server/

# Copy skills (the content the server serves)
COPY skills/ ./skills/

# Point at the baked-in skills
ENV PD_SKILLS_DIR=/app/skills
ENV PORT=8080
ENV HOST=0.0.0.0

# Non-root user
RUN groupadd -g 10001 app && useradd -u 10001 -g app -m app
USER app

EXPOSE 8080

CMD ["node", "server/server.js"]
