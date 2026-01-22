FROM node:20-slim

WORKDIR /app

ENV NODE_OPTIONS="--dns-result-order=ipv4first"


COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
