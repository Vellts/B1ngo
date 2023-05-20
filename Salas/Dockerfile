FROM node:20-alpine3.17

RUN mkdir -p /usr/lobbies/app

WORKDIR /usr/lobbies/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]