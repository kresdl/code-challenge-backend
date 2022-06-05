FROM node:14-alpine as base
WORKDIR /app
COPY package*.json .
EXPOSE 5000

FROM base as prod
RUN npm ci
COPY . .
RUN npm run tsc
CMD ["npm", "start"]

FROM base as dev
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]
