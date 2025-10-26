# syntax=docker/dockerfile:1.6

# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies (cached)
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build (optional; safe to noop if your app has no build step)
FROM deps AS build
COPY . .
RUN npm run build || true

# Development image (hot-reload via your dev command)
FROM base AS dev
ENV NODE_ENV=development
# Reuse deps from earlier stage
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
# Provide DEV_COMMAND in env (e.g., "npm run dev" or "next dev")
CMD ["sh","-c","${DEV_COMMAND:-npm run dev}"]

# Production image
FROM base AS prod
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm","start"]
