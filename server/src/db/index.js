const mysql = require("mysql2/promise"); //npm install mysql2

const db = mysql.createPool({
	host: process.env.DB_URL || '127.0.0.1',
	port: process.env.DB_PORT || '3306',
	user: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || 'AlgoViz123!',
	database: process.env.DB_NAME || "algoviz",
	multipleStatements: true
});

module.exports.db = db;