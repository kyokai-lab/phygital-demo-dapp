FROM node:18.12.1-alpine AS base
RUN apk update && \
    apk add git && \
		apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*

RUN npm i -g pnpm

FROM base AS dependencies
# Create app directory
WORKDIR /app
# Install app dependencies if needed
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "next", "start"]