FROM node:22-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Add build arguments
ARG NODE_ENV=development
ARG VITE_SYNC_SERVER_ENDPOINT

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV VITE_SYNC_SERVER_ENDPOINT=${VITE_SYNC_SERVER_ENDPOINT}

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files from workspaces to maintain structure
COPY packages/ ./packages/
COPY products/ ./products/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy remaining source files
COPY . .

# Build the app
RUN cd products/app && pnpm build-only

# Create output directory for static files
RUN mkdir -p /dist && cp -r /app/products/app/dist/* /dist/ 