/**
 * Handles the requests made to /api/searches/ endpoint
 */
const pathfinding = require("../algorithms/pathfinding.js");

const express = require("express");
const router = express.Router();

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json());

router.post("/dfs", (req, res) => {
    var r = pathfinding.dfs(req.body.graph, req.body.start, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/bfs", (req, res) => {
    var r = pathfinding.bfs(req.body.graph, req.body.start, req.body.target);
    res.status(200).send({
        result: r,
    });
});

router.post("/astar", (req, res) => {
    var r = pathfinding.aStar(req.body.graph, req.body.start, req.body.target);
    res.status(200).send({
        result: r,
    });
});

module.exports = router;
