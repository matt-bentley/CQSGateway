FROM node:10-alpine

WORKDIR /usr/src/app

COPY /CQSGateway.QueryApi/package*.json ./
RUN npm install

COPY /CQSGateway.QueryApi .

ENV MONGO_HOST="172.17.0.2"

CMD [ "node", "app.js" ]