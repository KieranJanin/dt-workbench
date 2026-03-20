# Use the official Node.js image as the base image
FROM node:20-alpine AS base

# Install turbo globally
RUN npm install turbo --global

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args if you have environment variables that must be present at build time
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npx turbo build --filter=web

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup -S nodeuser && adduser -S nodeuser -G nodeuser

USER nodeuser

COPY --from=installer /app/apps/web/next.config.ts .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nodeuser:nodeuser /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nodeuser:nodeuser /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nodeuser:nodeuser /app/apps/web/public ./apps/web/public

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "apps/web/server.js"]
