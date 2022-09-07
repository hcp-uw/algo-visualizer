/**
 * Handles the requests made to /api/searches/ endpoint
 */
const searches = require("../algorithms/searches.js");

const express = require("express");
const router = express.Router();

// attach the body as a json into res variable
router.use(express.json());

router.post("/binarysearch", (req, res) => {
    let r = searches.binarySearch(req.body.data, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/linearsearch", (req, res) => {
    let r = searches.linearSearch(req.body.data, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/depthfirstsearch", (req, res) => {
    let r = searches.depthFirstSearch(req.body.data, req.body.target);
    res.status(200).send({
        result: r,
    });
});

module.exports = router;
