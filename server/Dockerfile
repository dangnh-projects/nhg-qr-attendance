FROM node:alpine
RUN apk add --no-cache tzdata

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000
CMD [ "yarn", "start" ]