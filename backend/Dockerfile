# Sử dụng Node.js phiên bản 18
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install bcryptjs

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]