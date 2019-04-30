FROM node:alpine
EXPOSE 3000

WORKDIR /usr/app/src

RUN apk add \
    g++ \
    make \
    python2

COPY package.json ./

RUN yarn global add \
    nodemon \
    @nestjs/cli \
    @nestjs/schematics \
    && yarn install \
    && yarn cache clean

COPY . .

CMD [ "yarn", "start"]
