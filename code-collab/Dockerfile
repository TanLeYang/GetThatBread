FROM node:16-alpine as builder

WORKDIR /usr

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

FROM node:16-alpine

WORKDIR /usr

COPY package.json ./
RUN npm install --only=production
COPY --from=builder /usr/dist .
RUN npm install pm2 -g
EXPOSE 5001

CMD ["pm2-runtime", "server.js"]