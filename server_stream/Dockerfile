FROM node:10-alpine

WORKDIR /server-stream

RUN \
    apk update && \
    apk add git ffmpeg && \
    rm -rf /var/cache/apk/*

COPY package.json ./
RUN npm install -qy

COPY . .

EXPOSE 3000

CMD ["npm", "start"]