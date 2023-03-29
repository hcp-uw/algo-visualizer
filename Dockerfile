# The following Dockerfile is run whenever we want to build & deploy the whole Algo-Viz code locally.
# See README for how to build and deploy locally.

FROM --platform=linux/amd64 node:14.17.0-alpine

RUN npm install -g nodemon

ENV REACT_APP_PRODUCTION=false

WORKDIR /app

# copy over json files first to assist in building package dependencies
COPY ./server/package.json /app/server/package.json
COPY ./server/tsconfig.json /app/server/tsconfig.json
COPY ./client/package.json /app/client/package.json
COPY ./client/tsconfig.json /app/client/tsconfig.json

# set up server package dependencies early to preserve caching
WORKDIR /app/server
RUN npm install

# set up client package dependencies early to preserve caching
WORKDIR /app/client
RUN npm install

# copy over client code and build it
COPY ./client /app/client
RUN npm run build

# copy over server code and build it
WORKDIR /app/server
COPY ./server /app/server
RUN npm run build

# required for docker desktop port mapping
EXPOSE 3001

CMD ["npm", "start"]