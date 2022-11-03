# algo-visualizer

The Express server should be started with Postgres database before running the React client.

## **Running guide**:

If you don't have Node.js, install it from the [official website](https://nodejs.org/en/).

# Backend

Open a terminal on VS Code. Follow the following steps on terminal:

1. Change directory to `server` folder

```cmd
cd server
```

2. Install necessary packages (Repeat for new new package isntalled)

```cmd
npm install
```

3. Compile Typescript (Repeat for every new changes)

```
npm run build
```

4. Start server

```
npm start
```

# Frontend

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

# Database

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
