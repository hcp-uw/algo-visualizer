# algo-visualizer

Welcome to the HCP Algorithm Visualizer project. This repository contains the front-end React application in the `client` folder and the back-end Node.js application in the `server` folder. The following information will explain how to set up the development environment for your to run and test the codebase on your local machine.

# Starting up Front-end React App and Back-end Node.js App

There are two ways to start the codebase's front-end and back-end locally in your dev environment:
1. Npm Setup (faster, but more commands needed, recommended for newcomers)
2. Docker Compose (slower, but less commends needed, useful for long-term contributors)

## **Npm Setup**:

This approach is more organic and you're probably used to this approach if you have experience developing Node.js or React apps.

First, if you don't have Node.js, install it from the [official website](https://nodejs.org/en/).

### Starting Backend

Open a terminal on VS Code. Follow the following steps on terminal:

1. Change directory to `server` folder

```cmd
cd server
```

2. Install necessary packages

```cmd
npm install
```
Do `npm install <package_name>` if you want to install more specific packages in the future. Same for front-end.

3. Compile Typescript (Repeat for every new changes)

```
npm run build
```

4. Start Node.js server

```
npm start
```

From now onward, if you make changes to the back-end and you want to view the effects of your latest changes, just do Steps 3 and 4.

If you want to run the back-end tests, do the following
```
npm run build
npm test
```

### Starting Frontend

Open a terminal on VS Code. Follow the following steps on terminal:

1. Change directory to `client` folder

```cmd
cd client
```

2. Install necessary packages

```cmd
npm install
```

There might be warnings for vulnerabilities after packages are installed. Run `npm audit fix` to repair any critical severity vulnerabilities. After going through this process, the website will be functional and hosted on `localhost:3000`.

3. Start React App server

```cmd
npm start
```

From now onward, if you make changes to the front-end and you want to view your the effects of your latest changes, just save your code and/or do Step 3.


## Starting up Database

TODO!!

## Heroku Deployment

As of March 4th, 2023, the Algo Viz codebase is hosted on Heroku on Vikram Nithyanandam's Heroku account.
Currently, our codebase is deployed to Heroku automatically via Github Actions on the `production` branch. Whenever you want to update the `production` branch with our latest `main` branch code, submit a pull request from `main` to `production`. The deployment process makes use of the `Dockerfile.web` file in root folder, which provide instructions to construct the Docker image for the Algo-Viz application.

To **deploy to Heroku manually without Github Actions**, you can run the following in your Heroku CLI (assuming you have Vikram's credentials). Please avoid running this on non-main branch when possible.

```cmd
heroku container:push web --app algo-vizualizer --recursive
heroku container:release web --app algo-vizualizer
```

If you want to **deploy Algo-Viz via Docker locally**, run the following Terminal commands to make use of `Dockerfile` file:

```cmd
docker build -f Dockerfile -t algo-viz .
docker run -p 3001:3001 -t algo-viz
```