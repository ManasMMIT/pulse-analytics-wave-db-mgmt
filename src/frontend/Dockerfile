FROM node:lts

WORKDIR /polaris-app

COPY package.json .

RUN yarn

EXPOSE 3000

COPY . .