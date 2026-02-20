ARG SERVICE

# -----------------------------
# Stage: Build
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

COPY services/${SERVICE}/package.json ./services/${SERVICE}/package.json

RUN pnpm install --frozen-lockfile --filter ${SERVICE}...

COPY services/${SERVICE}/tsconfig.json ./services/${SERVICE}/tsconfig.json
COPY services/${SERVICE}/src ./services/${SERVICE}/src

WORKDIR /app/services/${SERVICE}

RUN pnpm run build

# -----------------------------
# Stage: Production
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app/services/${SERVICE}/dist ./dist
COPY --from=build /app/node_modules ./node_modules

COPY services/${SERVICE}/.env ./services/${SERVICE}/.env

EXPOSE 3000

ENV NODE_ENV=production

WORKDIR /app

CMD ["node", "dist/main.js"]

# -----------------------------
# Stage: Development
FROM node:20-alpine AS dev

ARG SERVICE

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./

COPY services/${SERVICE}/package.json ./services/${SERVICE}/package.json

RUN pnpm install --filter ${SERVICE}...

COPY services/${SERVICE} ./services/${SERVICE}

WORKDIR /app/services/${SERVICE}

EXPOSE 3000

# debug port
EXPOSE 9229

# run binaries from root
CMD ["pnpm", "dlx", "tsx", "watch", "src/main.ts", "--inspect=0.0.0.0:9229"]