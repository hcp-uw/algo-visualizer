/**
 * Handles the requests made to /api/feedback/ endpoint.
 * For bug report.
 */
const express = require("express");
const router = express.Router();
const db = require("../db");

// attach the body as a json into res variable
router.use(express.json());

router.post("/", async (req, res) => {
    req.body.browserInfo["user-agent"] = req.get("User-Agent");
    const params = [
        req.body.message,
        req.body.browserInfo,
        req.body.algorithmData,
    ];

    const query =
        "INSERT INTO Feedback (Message, Browser_info, Algorithm_data) VALUES ($1, $2, $3);";

    try {
        await db.query(query, params);
    } catch (err) {
        console.log(err);

        res.status(500).send({
            error: err,
        });
        return;
    }

    res.status(200).send({
        success: true,
    });
});

module.exports = router;
