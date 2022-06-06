FROM node:14-alpine as base
WORKDIR /app
COPY package*.json ./
EXPOSE 5000

FROM base as prod
RUN npm ci
COPY . .
CMD ["sh", "start-prod.sh"]

FROM base as dev
RUN npm i
COPY . .
CMD ["sh", "start-dev.sh"]
