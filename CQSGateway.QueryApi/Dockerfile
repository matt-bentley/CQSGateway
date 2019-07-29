FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ENV MONGO_HOST="172.17.0.2"

CMD [ "node", "app.js" ]