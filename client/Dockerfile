FROM --platform=linux/amd64 node:14.17.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

RUN rm -r src
RUN rm -r node_modules

# required for docker desktop port mapping
EXPOSE 3000

CMD ["npx", "serve", "build"]