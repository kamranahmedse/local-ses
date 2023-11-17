FROM node:20-bullseye-slim

ARG DEBIAN_FRONTEND=noninteractive
LABEL org.opencontainers.image.authors="kamranahmed.se@gmail.com"

WORKDIR /app
RUN chown -R node:node /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
  pnpm install --frozen-lockfile --prefer-frozen-lockfile

USER node
COPY --chown=node:node . .

RUN npm run build

EXPOSE 8282

CMD ["npm", "run", "prod"]