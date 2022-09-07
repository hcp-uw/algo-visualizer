/**
 * Handles the requests made to /api/sorts/ endpoint.
 */
const sorts = require("../algorithms/sorts.js");

const express = require("express");
const router = express.Router();

// attach the body as a json into res variable
router.use(express.json());

router.post("/bubblesort", (req, res) => {
    var r = sorts.bubbleSort(req.body.data);
    res.status(200).send({
        result: r,
    });
});

router.post("/insertionsort", (req, res) => {
    var r = sorts.insertionSort(req.body.data);
    res.status(200).send({
        result: r,
    });
});

router.post("/selectionsort", (req, res) => {
    var r = sorts.selectionSort(req.body.data);
    res.status(200).send({
        result: r,
    });
});

router.post("/mergesort", (req, res) => {
    var r = sorts.mergeSort(req.body.data);
    res.status(200).send({
        result: r,
    });
});

module.exports = router;
