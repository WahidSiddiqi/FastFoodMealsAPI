const express = require("express");
const passport = require("passport");
const nutritionix = require("../../lib/nutritionix");
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

router.get(
  "/search",
  /*requireToken,*/ async (req, res, next) => {
    try {
      const results = await nutritionix.get(
        `/search/instant?branded=true&query=${req.query.search}`
      );
      console.log({ data: results.data });
      res.json({ results: results.data || null });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
  }
);

module.exports = router;
