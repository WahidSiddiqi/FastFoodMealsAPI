const axios = require("axios");

const instance = axios.create({
  baseURL: " https://trackapi.nutritionix.com/v2",
  timeout: 1000 * 10,
  headers: {
    "Content-Type": "application/json",
    "x-app-id": process.env.NUTRITIONIX_APP_ID,
    "x-app-key": process.env.NUTRITIONIX_APP_KEY,
  },
});

module.exports = instance;
