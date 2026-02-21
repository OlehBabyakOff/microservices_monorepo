# =============================================
# Stage: Base (shared dependencies)
FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable

COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml* tsconfig.base.json ./

RUN pnpm install --frozen-lockfile

# =============================================
# Stage: Build
FROM base AS build

COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src

WORKDIR /app/services/api-gateway

RUN pnpm run build

# =============================================
# Stage: Production
FROM node:20-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache curl \
    && corepack enable \
    && addgroup -S nodejs \
    && adduser -S nodejs -G nodejs

COPY ./package.json ./package.json

COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/services/api-gateway/dist ./dist

RUN pnpm prune --prod

EXPOSE 3000

USER nodejs

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]

# =============================================
# Stage: Development
FROM base AS dev

WORKDIR /app/services/api-gateway

RUN corepack enable

COPY services/api-gateway/. ./

RUN pnpm install

EXPOSE 3000

# Debugging port
EXPOSE 9229

CMD ["pnpm", "dev"]