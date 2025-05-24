FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY docs ./docs

# Build docs
RUN pnpm docs:build

# Create output directory for static files
RUN mkdir -p /dist && cp -r /app/docs/.vitepress/dist/* /dist/