FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

COPY ./src ./src

COPY . .

RUN npm install \
    && npm run build

EXPOSE 3000

CMD [ "npm", "start" ]