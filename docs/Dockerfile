# Build stage
FROM node:18-alpine as build

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

# Production stage
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]