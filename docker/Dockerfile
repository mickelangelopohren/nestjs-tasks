FROM node:22

WORKDIR /app

ENV TZ=UTC

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:prod"]