FROM node:10.8.0-stretch

WORKDIR /usr/server

COPY package.json ./
RUN npm install -qy

COPY . .

EXPOSE 8080

CMD ["npm", "start"]