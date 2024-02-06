FROM node:latest
WORKDIR /nestjs-server
COPY package*.json ./
COPY prisma ./prisma/


RUN npm install
COPY . .
RUN npx prisma generate


CMD [ "npm", "run", "start:dev" ]
