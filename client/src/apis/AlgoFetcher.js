import axios from "axios";

// URL based on NODE_ENV

const baseURL =
    process.env.NODE_ENV === "production" ? "api" : "http://localhost:3001/api";

export default axios.create({
    baseURL,
});
