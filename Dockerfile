FROM node:12

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]
