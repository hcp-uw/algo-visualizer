FROM --platform=linux/amd64 node:14.17.0-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

# required for docker desktop port mapping
EXPOSE 3001

CMD ["npm", "start"]