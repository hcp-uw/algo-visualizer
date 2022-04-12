const searches = require("../algorithms/searches.js");

const express = require("express");
const router = express.Router();

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json());

router.post("/binarysearch", (req, res) => {
    var r = searches.binarySearch(req.body.array, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/linearsearch", (req, res) => {
    var r = searches.linearSearch(req.body.array, req.body.target);
    res.status(200).send({
        result: r,
    });
});

module.exports = router;
