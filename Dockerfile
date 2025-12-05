FROM node:25-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs:18

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["build/index.js"]
