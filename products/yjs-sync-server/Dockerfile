# Build stage
FROM node:22-slim AS builder

# Set working directory for the monorepo
WORKDIR /app

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy root workspace files first
COPY pnpm-workspace.yaml ./

# Copy package files for workspace and dependencies
COPY package.json pnpm-lock.yaml ./
COPY products/yjs-sync-server/package.json ./products/yjs-sync-server/package.json

# Install dependencies (excluding husky)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# Copy source files for the yjs-sync-server
COPY products/yjs-sync-server/tsconfig.json ./products/yjs-sync-server/
COPY products/yjs-sync-server/src ./products/yjs-sync-server/src

# Build the yjs-sync-server
RUN pnpm --filter "@nodenogg.in/yjs-sync-server" build

# Production stage
FROM node:22-slim

# Create a non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Set working directory
WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY products/yjs-sync-server/package.json ./products/yjs-sync-server/

# Copy built files
COPY --from=builder /app/products/yjs-sync-server/dist ./products/yjs-sync-server/dist

# Install production dependencies (excluding husky and other dev scripts)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --ignore-scripts

# Set proper permissions
RUN chown -R nodejs:nodejs /app

# Use non-root user
USER nodejs

# Expose WebSocket port
EXPOSE 8787

# Start the server
CMD ["node", "products/yjs-sync-server/dist/index.cjs"] 