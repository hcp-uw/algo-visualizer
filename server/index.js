const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// // to access request's body
// app.use(express.urlencoded( { extended: true }));

// cors allows/restricts requests from different domain
app.use(cors());

// searches api
app.use("/searches", require("./routes/searches.js"));

app.listen('3001', () => {
    console.log("Server up and running on port: 3001");
})