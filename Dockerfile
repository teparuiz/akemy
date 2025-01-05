# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

COPY database.sqlite /tmp/database.sqlite

RUN chown node:node /tmp/database.sqlite

USER node

EXPOSE 3000

CMD ["node", "index.js"]
