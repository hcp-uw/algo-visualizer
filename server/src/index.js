const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const rateLimit = require("express-rate-limit");

// for local testing
// dotenv load the .env file as enviroment variables

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// attach the body as a json into res variable
app.use(express.json());

// cors allows/restricts requests from different domain
app.use(cors());

// provides middlewares for node server to serve front-end build files
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

// basic rate limiter
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// searches api
app.use("/api/searches", require("./routes/searches.js"));

// sorts api
app.use("/api/sorts", require("./routes/sorts.js"));

// feedback api
app.use("/api/feedback", require("./routes/feedback.js"));

app.listen(process.env.PORT || 3001, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 3001));
});
