# Standard Installation and Setup

First, if you don't have Node.js, install it from the [official website](https://nodejs.org/en/).

## Starting Backend

Open a terminal on VS Code and check you're at your project root folder. Follow the following steps on terminal:

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

## Starting Frontend

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


## Starting Database

In process of documenting this! Currently, the database is not very necessary since we only use it to store feedback from users. However, we have our database hosted on SimpleDB as an add-on to Heroku. Contact whoever is hosting AlgoViz to get the DB credentials/environment variables to access.


# Local Docker Deployment

If you want to deploy Algo-Viz via Docker locally, first ensure that you have Docker Desktop installed and the Docker CLI installed. Then, run the following Terminal commands to make use of root `Dockerfile` file:

```cmd
docker build -f Dockerfile -t algo-viz .
docker run -p 3001:3001 -t algo-viz
```

This will take a while, but will deploy your codebase at `localhost:3001` (not 3000) because our back-end serves the static build files from our front-end

# Heroku Deployment

As of March 4th, 2023, the Algo Viz codebase is hosted on Heroku on Vikram Nithyanandam's Heroku account.
Currently, our codebase is deployed to Heroku automatically via Github Actions on the `production` branch. Whenever you want to update the `production` branch with our latest `main` branch code, submit a pull request from `main` to `production`. The deployment process makes use of the `Dockerfile.web` file in root folder, which provide instructions to construct the Docker image for the Algo-Viz application.

To **deploy to Heroku manually without Github Actions**, you can run the following in your Heroku CLI (assuming you have Vikram's credentials) at the root folder.

**ONLY do this if you need to test something Docker + Heroku related that cannot be tested without deploying.**

```cmd
heroku container:push web --app algo-vizualizer --recursive
heroku container:release web --app algo-vizualizer
```

Now, if you want to test the Github Action specifically without merging to production branch, then you can do the following:

Navigate to `.github/workflows/main.yml` and check the following code block:
```code
# Run workflow on every push to main branch.
on:
  push:
    branches: [production]
```

and rename `production` to your current branch. Then, once you commit and push to Github, the Github action will run on your separate branch. **Do NOT use this approach for testing regular code on production unless absolutely necessary.**
