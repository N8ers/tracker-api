FROM node

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm un build

WORKDIR ./dist

CMD node index.js
