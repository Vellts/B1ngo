FROM node:20-alpine3.17

RUN mkdir -p /usr/auth/app

WORKDIR /usr/auth/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]