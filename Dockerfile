FROM node:lts-alpine
RUN apk --no-cache add git

WORKDIR /polaris

COPY package.json .

RUN yarn --production

EXPOSE 1337

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]