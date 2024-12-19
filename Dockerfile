FROM node:iron-alpine3.19 AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# nextjs production require this for image optimization
RUN npm install sharp
RUN npm run build

FROM base AS runner
WORKDIR /app
ARG TARGET_ENV="development"
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.env.$TARGET_ENV ./.env.local

USER nextjs

EXPOSE 3000

ENV PORT=3000
CMD HOSTNAME="0.0.0.0" node server.js
