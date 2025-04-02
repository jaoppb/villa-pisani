FROM node:22-alpine AS desc

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

FROM node:22-alpine AS metadata

WORKDIR /app
COPY --from=desc /app ./

RUN npx nest build -w & \
	PID=$! && \
	while [ ! -f ./src/metadata.ts ]; do sleep 0.2; done && \
	kill $PID && \
	cp ./src/metadata.ts /tmp/metadata.ts

FROM node:22-alpine AS build

WORKDIR /app
COPY --from=metadata /app ./
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=build /app ./
CMD ["npm", "run", "start:dev"]