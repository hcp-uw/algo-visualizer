FROM node:17-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

EXPOSE 3001
# required for docker desktop port mapping

CMD ["npm", "run", "dev"]