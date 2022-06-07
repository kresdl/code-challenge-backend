FROM node:14-alpine as base
WORKDIR /app
COPY package*.json ./
EXPOSE 5000

FROM base as prod
RUN npm ci
COPY . .
RUN node_modules/.bin/tsc -p .
CMD ["node", "--experimental-specifier-resolution=node", "build/index.js"]

FROM base as dev
RUN npm i
COPY . .
CMD ["node_modules/.bin/nodemon", "src/index.ts"]
