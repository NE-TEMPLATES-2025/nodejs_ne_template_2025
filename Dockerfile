FROM node:slim


WORKDIR /app
COPY . .
COPY package*.json ./


RUN ["npm","install"]

RUN apt-get update -y && apt-get install -y openssl

EXPOSE 5000

ENTRYPOINT [ "npm","run","dev"]
