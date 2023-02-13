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

There might be warnings for vulnerabilities after packages are installed. Run the suggested commands to repair any critical severity vulnerabilities. After going through this process, the website will be functional and hosted on `localhost:3000`.

3. Start React App server

```cmd
npm start
```

From now onward, if you make changes to the back-end and you want to view your the effects of your latest changes, just do Step 3.

## **Docker Compose**:

The other way to start the whole codebase on your local machine with just one command is through Docker! Our codebase has been setup so that the front-end and back-end are containerized and can be started with just one command.

First, ensure that you have a Docker account and you have the Docker application installed

1. Check you have Docker CLI by ensure you get the latest version when you run the following command:
```cmd
docker -v
```

2. Ensure that you are logged into your Docker account in Docker CLI by running
```cmd
docker login
```

3. Then, at the root of the repository folder, run the following command:
```cmd
docker compose up
```
This will build the Docker images for the front-end and back-end and the website will be hosted on your `localhost:3000` while the back-end is listen on port 3001.

4. When you're done or want to refresh or stop using those ports, run the following at the root folder
```cmd
docker compose down
```

## Starting up Database

Note that at the current state, the database isn't necessary for the AlgoViz to function, it would just make the "Provide Feedback" function useless. Also, the Postgres setup guide below is in dire need of improvement, which we plan to do over the next few months (as of Feb 13th, 2023)

**Postgresql Download**

Follow the Postgres' official [site](https://www.postgresql.org/download/) and select your OS to install Postgres. During setup, use either password `test123` or your own, but then `PGPASSWORD` variable in .env file must be modified for the database to run correctly. Other fields can be left as default.

UPDATE from Vikram:: I found these two links useful
Video for Installing Postgres: https://www.youtube.com/watch?v=wTqosS71Dc4
Download page that's used in the video: https://postgresapp.com/downloads.html

**Database Setup and Monitor**

1. To start PSQL, there are two options:
    - Open `SQL Shell`. A quick search from start menu should find it, or it should be located at `C:\Program Files\PostgreSQL\<POSTGRES VERSION>\scripts\runpsql.bat`
    - Add psql to PATH (e.g. for [Windows](https://blog.sqlbackupandftp.com/setting-windows-path-for-postgres-tools)). Then `psql -U postgres` can be used to start SQL shell from any shell.
2. Login with default parameters (press enter when prompted) and saved password (default `test123`). After logging in you can make direct database queries through the command line
3. Copy and run the content of `./server/src/db/SetupTables.sql` to setup tables.

**Setup environment variables** (for local testing)

Create a file called `.env` in `./server/` folder with the following content:

```
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=test123
PGDATABASE=postgres
PGPORT=5432
```

Express will use this credentials to login to Postgres database.


## Heroku Deployment

As of February 14th, 2023, the Algo Viz codebase is hosted on Heroku on Vikram Nithyanandam's Heroku account. When logged into that account, run the following commands to deploy the latest front-end or back-end code to our production website. These commands make use of the `Dockerfile.web` files in both the `client` and `server` folders, which provide instructions to construct Docker images for the front-end and back-end applications. From there we can deploy those Docker images to Heroku and release it. 

**Note, these commands must only be run on the main branch**

### Deploying Front-end

```cmd
cd client
heroku container:push web --app algo-viz-client --recursive
heroku container:release web --app algo-viz-client
```

### Deploying Back-end

```cmd
cd server
heroku container:push web --app algo-viz-server --recursive
heroku container:release web --app algo-viz-server
```

To view the deployed front-end, visit [https://algo-viz-client.herokuapp.com/](https://algo-viz-client.herokuapp.com/) or run `heroku open` in your Terminal.

To check the back-end is running, visit [https://algo-viz-server.herokuapp.com/](https://algo-viz-server.herokuapp.com/). You should see the word `Positive` being returned.
