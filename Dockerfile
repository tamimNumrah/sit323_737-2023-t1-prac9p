FROM node:16 
LABEL authors="Tamim Ibn Aman"
# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js .

#RUN cp .env.example .env
EXPOSE 8080
CMD ["node","server.js"]