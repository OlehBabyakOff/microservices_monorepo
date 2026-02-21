# =============================================
# Stage: Base (shared dependencies)
FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable

# workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# service files
COPY services/api-gateway/package.json services/api-gateway/package.json

RUN pnpm install --frozen-lockfile

# =============================================
# Stage: Build
FROM base AS build

COPY . .

RUN pnpm --filter api-gateway build

# =============================================
# Stage: Production
FROM node:20-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY services/api-gateway/package.json services/api-gateway/package.json

RUN pnpm install --frozen-lockfile --prod --filter api-gateway...

COPY --from=build /app/services/api-gateway/dist ./services/api-gateway/dist

WORKDIR /app/services/api-gateway

EXPOSE 3000

CMD ["node", "dist/main.js"]

# =============================================
# Stage: Development
FROM base AS dev

WORKDIR /app

COPY . .

EXPOSE 3000

# Debugging port
EXPOSE 9229

CMD ["pnpm", "--filter", "api-gateway", "dev"]