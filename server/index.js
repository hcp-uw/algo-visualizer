const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// // to access request's body
// app.use(express.urlencoded( { extended: true }));

// cors allows/restricts requests from different domain
app.use(cors());

// searches api
app.use("/api/searches", require("./routes/searches.js"));

// sorts api
app.use("/api/sorts", require("./routes/sorts.js"));

// pathfinding api
app.use("/api/pathfinding", require("./routes/pathfinding.js"));

app.listen(process.env.PORT || 3001, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 3001));
});
