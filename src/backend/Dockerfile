FROM node:lts

WORKDIR /polaris-api

COPY package.json .

RUN yarn

EXPOSE 1337

COPY . .