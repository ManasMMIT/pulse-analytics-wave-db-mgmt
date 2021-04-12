FROM node:lts

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb http://repo.mongodb.com/apt/debian stretch/mongodb-enterprise/4.2 main" | tee /etc/apt/sources.list.d/mongodb-enterprise-4.2.list
RUN apt-get update && apt-get install -y mongodb-enterprise-tools=4.2.1

RUN echo "mongodb-enterprise-tools hold" | dpkg --set-selections

WORKDIR /polaris

RUN mkdir -p ./src/backend/logs

COPY package.json .

COPY .npmrc .npmrc

RUN yarn --production

EXPOSE 1337

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]
