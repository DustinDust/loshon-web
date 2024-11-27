FROM node:iron-alpine3.19 AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM base AS builder
ARG TARGET_ENV="development"
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY ./.env.$TARGET_ENV ./env.local
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.env* ./

USER nextjs

EXPOSE 3002

ENV PORT=3002
CMD HOSTNAME="0.0.0.0" node server.js
