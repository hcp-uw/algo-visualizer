# algo-visualizer

Welcome to the HCP Algorithm Visualizer project. This repository contains the front-end React application in the `client` folder and the back-end Node.js application in the `server` folder. The following information will explain how to set up the development environment for your to run and test the codebase on your local machine.

**If you find mistakes, please submit an Issue to our Issue board and identify the issue for us! Thank you!

# Setting up Development Environment

## Standard Installation and Setup Locally

First, if you don't have Node.js, install it from the [official website](https://nodejs.org/en/).


### Starting Backend

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

From now onward, if you make changes to the front-end and you want to view the effects of your latest changes, just save your code and/or do Step 3.


### Starting Database (note, not crucial to setup)

**Initial Setup**

To start up your database locally, you'll first need to install mySQL locally. Visit [here](https://dev.mysql.com/downloads/mysql/) to download mySQL. In case you're a Mac user, get the ARM64 version if you have an Apple Silicon chip or get the x86-64 bit version if you have a 64-bit Intel chip. Once you make your choice, don't bother creating an Oracle Web Account if offered to, and just click `"No thanks, just start my download."` to get that started. Once the `.dmg` file installs, open it, open the package, and complete the MySQL installation.

When it asks for a MySQL server password for the root user, just pick whatever is simple and works for your local machine. For the purposes of this setup guide, we'll choose `"AlgoViz123!"`

Now, we encourage you to use the Database extension provided by VSCode to set up a connection to a local database and to create your database. Open it up and click the "+" button available at the top of the Database sidebar to create a connection to your MySQL database. You'll see several fields pop up. Fill in the following:

Here are the necessary fields to plug into setting up the connection:
- **Host URL**: 127.0.0.1 (a.k.a localhost)
- **Username**: root
- **Password**: AlgoViz123! (or whatever password you chose for your database)
- **Port**: 3306
- **Name**: algoviz (or whatever variation of algoviz you want)

Next, click the "+" symbol next the the database connection that you created. When you hover over it, the label should say "New Database". This will open up a page with a script to create a new database. Add your chosen name of your database next to the command `CREATE DATABASE`. It should look like this:

```code
-- Active: 1678214754850@@127.0.0.1@3306
CREATE DATABASE algoviz
    DEFAULT CHARACTER SET = 'utf8mb4';
```

Click the little `> Execute` button above the script that VSCode provides. This should successfully create a database under your MySQL connection.

**Schema Setup**
Now, to set up the Feedback table of the project, navigate to our SQL code at `/server/src/db/SetupTables.sql`. In VSCode, click the two Execute statements to drop the table in case it exists and then create the table with the specified schema. There should be green logging from the Database extension proving that the table was successfully made. To verify this further, you can go into the Database extension and view its contents.


However, we have our production database hosted on SimpleDB as an add-on to Heroku. Contact whoever is hosting AlgoViz to get the DB credentials/environment variables to access the hosted database and use the SequelAce application to gain secure access to that database and see its contents.

**Codebase Connection**

To ensure that your code is able to connect to your local codebase, go to `server/src/db/index.js` and ensure that you plug in your correct database password into the password field on line 7. Or, create a `.env` file in the `server` folder and assign the correct environment variables in there.


### Local Docker Deployment

If you want to deploy Algo-Viz via Docker locally, first ensure that you have Docker Desktop installed and the Docker CLI installed. Then, run the following Terminal commands to make use of root `Dockerfile` file:

```cmd
docker build -f Dockerfile -t algo-viz .
docker run -p 3001:3001 -t algo-viz
```

This will take a while, but will deploy your codebase at `localhost:3001` (not 3000) because our back-end serves the static build files from our front-end


## Production Deployment via Heroku

**NOTE: the following is only relevant to actual members of the AlgoViz team. If you're just a passing visitor, this won't be relevant to you**

As of March 4th, 2023, the Algo Viz codebase is hosted on Heroku on Vikram Nithyanandam's Heroku account.
Currently, our codebase is deployed to Heroku automatically via Github Actions on the `production` branch. Whenever you want to update the `production` branch with our latest `main` branch code, submit a pull request from `main` to `production`. The deployment process makes use of the `Dockerfile.web` file in root folder, which provide instructions to construct the Docker image for the Algo-Viz application.

To **deploy to Heroku manually without Github Actions**, you can run the following in your Heroku CLI (assuming you have Vikram's credentials) at the root folder.

**ONLY do this if you need to test something Docker + Heroku related that cannot be tested without deploying.**

```cmd
heroku container:push web --app algo-visualizer --recursive
heroku container:release web --app algo-visualizer
```

Now, if you want to test the Github Action specifically without merging to production branch, then you can do the following:

Navigate to `.github/workflows/main.yml` and check the following code block:
```code
# Run workflow on every push to main branch.
on:
  push:
    branches: [production]
...
```

and rename `production` to your current branch. Then, once you commit and push to Github, the Github action will run on your separate branch and deploy the front-end and back-end code to Heroku. **Do NOT use this approach for testing regular code on production unless absolutely necessary.**

Now, when it comes to the MySQL database, we use a Heroku add-on called SimpleDB, which gives a free single MySQL database that we can use for AlgoViz and store feedback. Similar to the local fields that we set to connect to our local database, there are config environment variable values that SimpleDB provides us so that our production back-end can gain access to that database. To gain access to what that database contains, speak to the owner of the Heroku account.
