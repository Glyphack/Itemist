FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4000

CMD [ "npm", "run", "serve" ]
