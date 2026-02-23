# ----------------------------
# Multi-stage build for Next.js frontend
# ----------------------------

# ---------- Builder Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the source code
COPY . .

# Build Next.js for production
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy build from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port from Render environment
EXPOSE $PORT
ENV PORT $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get(`http://localhost:${process.env.PORT}`, (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js on Render's port
CMD ["node_modules/.bin/next", "start", "-p", "$PORT"]