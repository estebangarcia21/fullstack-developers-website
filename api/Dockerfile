FROM node:12-alpine as build

WORKDIR /usr

COPY package.json .
COPY tsconfig.json .
COPY src ./src

RUN npm install
RUN npm run build

FROM node:12-alpine

WORKDIR /usr
COPY package.json .

RUN npm install --only=production

COPY --from=build /usr/dist ./dist

CMD ["node", "dist/index.js"]
