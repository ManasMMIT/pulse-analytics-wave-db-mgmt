FROM node:lts

WORKDIR /code

COPY package.json .

COPY .npmrc .npmrc

RUN yarn