/**
 * Handles the requests made to /api/searches/ endpoint
 */
const searches = require("../algorithms/searches.js");

const express = require("express");
const router = express.Router();

// attach the body as a json into res variable
router.use(express.json());

router.post("/binarysearch", (req, res) => {
    var r = searches.binarySearch(req.body.array, req.body.target);
    r.url = "searches/binarysearch/";
    res.status(200).send({
        result: r,
    });
});

router.post("/linearsearch", (req, res) => {
    var r = searches.linearSearch(req.body.array, req.body.target);
    r.url = "searches/linearsearch/";
    res.status(200).send({
        result: r,
    });
});

module.exports = router;
