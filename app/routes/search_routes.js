const express = require("express");
const passport = require("passport");
const nutritionix = require("../../lib/nutritionix");
const mealItem = require("../models/mealItem");
const ObjectId = require("mongoose").Types.ObjectId;
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();

router.get(
  "/search",
  /*requireToken,*/ async (req, res, next) => {
    try {
      const results = await nutritionix.get(
        `/search/instant?branded=true&query=${req.query.query}`
      );
      console.log({ data: results.data });
      res.json({ results: results.data || null });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
  }
);

router.get("/item", requireToken, async (req, res, next) => {
  try {
    const nix_item_id = req.query.nix_item_id;

    const results = await nutritionix.get(
      `/search/item?nix_item_id=${nix_item_id}`
    );
    console.log({ data: results.data });
    res.json({ results: results.data || null });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

router.get("/item_by_object_id", requireToken, async (req, res, next) => {
  try {
    const item_id = req.query.item_object_id;
    console.log({ item_id });
    const item = await mealItem.findOne({
      _id: new ObjectId(item_id),
    });
    console.log({ item });
    res.json({ ...item._doc });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

module.exports = router;
