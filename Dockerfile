FROM node:20 AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 3003

CMD ["yarn", "run", "start"]