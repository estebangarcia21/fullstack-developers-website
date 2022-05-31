FROM node:12-alpine as build

WORKDIR /usr

COPY package.json .
COPY tsconfig.json .
COPY src ./src

RUN npm install yarn

RUN yarn install
RUN yarn build

FROM node:12-alpine

WORKDIR /usr
COPY package.json .


RUN npm install yarn
RUN yarn install --production

COPY --from=build /usr/dist ./dist

CMD ["node", "dist/index.js"]
