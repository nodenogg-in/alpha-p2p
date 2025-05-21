# Build stage
FROM node:22-slim AS builder

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

# Build workspace packages first
RUN pnpm --filter "@nodenogg.in/core" build && \
    pnpm --filter "@nodenogg.in/y-microcosm" build

# Build the app
RUN cd products/app && pnpm build-only

# Production stage
FROM nginx:alpine

# Copy the nginx configuration
COPY products/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files to nginx
COPY --from=builder /app/products/app/dist /usr/share/nginx/html

# Add permissions for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 