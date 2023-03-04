/**
 * Define a object called AlgoFetcher to communicate with the backend.
 *
 * eg. AlgoFetcher.get for get request, AlgoFetcher.post for post request
 */

import axios from "axios";

// URL based on NODE_ENV

const baseURL =
    process.env.REACT_APP_PRODUCTION === "true" ? "https://algo-viz-server.herokuapp.com/api" : "http://localhost:3001/api";

export default axios.create({
    baseURL,
});
