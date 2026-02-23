FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache docker-cli openjdk17

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache docker-cli openjdk17 openssl

COPY package*.json ./

RUN npm install --production

COPY prisma ./prisma

RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001
ENV DOCKER_ENABLED=true
ENV EXECUTION_TIMEOUT=5000
ENV MAX_MEMORY_MB=256

CMD ["npm", "start"]
