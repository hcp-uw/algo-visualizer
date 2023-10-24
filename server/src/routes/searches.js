/**
 * Handles the requests made to /api/searches/ endpoint
 */
const searches = require("../algorithms/searches.js");

const express = require("express");
const router = express.Router();

// attach the body as a json into res variable
router.use(express.json());

router.post("/binarysearch", (req, res) => {
    let r = searches.binarySearch(req.body.array, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/linearsearch", (req, res) => {
    let r = searches.linearSearch(req.body.array, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/depthfirstsearch", (req, res) => {
    let r = searches.depthFirstSearch(req.body.nodes, req.body.edges, req.body.startNode, req.body.targetNode);
    res.status(200).send({
        result: r,
    });
});

router.post("/breadthfirstsearch", (req, res) => {
    let r = searches.breadthFirstSearch(req.body.nodes, req.body.edges, req.body.startNode, req.body.targetNode);
    res.status(200).send({
        result: r,
    });
});

router.post("/dijkstrasearch", (req, res) => {
    let r = searches.dijkstraSearch(req.body.nodes, req.body.edges);
    res.status(200).send({
        result: r,
    });
});


module.exports = router;
