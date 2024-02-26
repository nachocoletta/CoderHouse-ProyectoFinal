FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source bcrypt

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]