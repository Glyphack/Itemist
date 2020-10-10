FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npm run collectassets

EXPOSE 4000

CMD [ "npm", "run", "prod" ]
