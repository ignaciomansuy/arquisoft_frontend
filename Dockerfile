FROM node:17-alpine

WORKDIR /app

COPY package.json /package.json

RUN apk add --update python3 make g++
RUN rm -rf /var/cache/apk/*
RUN npm install

COPY . .

EXPOSE 8000

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh

ENTRYPOINT "/entrypoint.sh"