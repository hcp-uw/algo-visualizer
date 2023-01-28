# **Algo-Viz**

The Express server should be started with Postgres database before running the React client.

# Running guide w/o Docker:

***Note***: The following information is for how to start up the codebase on your local machine **WITHOUT** Docker. If you want to see how to do it with Docker, scroll down to "Running Guide with Docker"

---

If you don't have Node.js, install it from the [official website](https://nodejs.org/en/).

## Backend

Open a terminal on VS Code. Follow the following steps on terminal:

1. Change directory to `server` folder

```cmd
cd server
```

2. Install necessary packages (Repeat for new new package isntalled)

```cmd
npm install
```

3. Start server

```
npm start
```
Behind the scenes, `npm start` runs `npm run build && node ./build/index.js`, because we need to build Typescript files before starting the server.

## Frontend

Open a terminal on VS Code. Follow the follwing steps on terminal:

1. Change directory to `client` folder

```cmd
cd client
```

2. Install necessary packages (Repeat for new new package isntalled)

```cmd
npm install
```

3. Start server

```cmd
npm start
```

There might be warnings for vulnerabilities after packages are installed. They can be ignored for now.

## Database

Note that at the current state, the database isn't necessary for the AlgoViz to function, it would just make the "Provide Feedback" function useless.

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

# Running guide **with** Docker:

This guide is currently in the process of being written.

First, if you haven't already created a Docker account and gotten the Docker application installed on your machine, please do that first.

Once you're done with that, confirm you have the Docker CLI installed by running

```
docker -v
docker --help
```
to get the version number of Docker and to verify that the various Docker commands are available to you


Then, at the root of the repository, run the following command to start the website
```
docker-compose up
```

When you've made changes to the code and you want to see the latest updates, you'll need to update the Docker image (which is the blueprints use to construct the Docker container) with the latest image. To keep it simple, we can just remove all current images/containers/volumes related to AlgoViz and then just set up and deploy a new one by doing this:

```
docker-compose down --rmi all -v
docker-compose up
```

But of course if you don't want to delete old images and keep them around just in case, just doing `docker-compose down` and then `docker-compose up` should suffice (unsure).

