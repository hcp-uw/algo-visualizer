# algo-visualizer

The Express server should be started with Postgres database before running the React client.

## **Running guide**:

If you don't have Node.js, install it from the [official website](https://nodejs.org/en/).

### **Start ExpressJS server**

From main directory:

1. Change directory to the `server` folder.
2. Install necessary packages.
3. Start the server.

```bash
cd server
npm install
npm start
```

### **Start React client**

From main directory:

1. Change directory to the `client` folder.
2. Install necessary packages.
3. Start the server.

```bash
cd client
npm install
npm start
```

### **Setup Posgresql Database** (for local testing)

**Postgresql Download**

Follow the Postgres' official [site](https://www.postgresql.org/download/) and select your OS to install Postgres. During setup, use password `test123` or your own but `PGPASSWORD` variable in .env file must be modified for the database to run correctly. Other fields can be left as default.

**Database setup and monitor**

1. To start PSQL: open SQL Shell from start menu or use `psql -U postgres` on any shell. Note that you must add psql to PATH before using custom shell.

2. Login with default parameters. After login you can make direct queries through the command line.

3. Copy and run the content of `./server/db/SetupTables.sql` to setup tables.

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
