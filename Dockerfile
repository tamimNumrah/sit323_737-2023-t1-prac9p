FROM node:16 
LABEL authors="Tamim Ibn Aman"
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY server.js .

RUN npm install
COPY . ./

#Healthcheck
#HEALTHCHECK CMD curl --fail http://localhost:8080
#RUN cp .env.example .env
EXPOSE 8080
CMD ["node","server.js"]