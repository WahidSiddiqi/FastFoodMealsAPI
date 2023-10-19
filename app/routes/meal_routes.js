const express = require("express");
const passport = require("passport");
const nutritionix = require("../../lib/nutritionix");
const requireToken = passport.authenticate("bearer", { session: false });
const router = express.Router();
const Meal = require("../models/meal");
const MealItem = require("../models/mealItem");

const ObjectId = require("mongoose").Types.ObjectId;

router.post("/add_item_to_meal", requireToken, async (req, res, next) => {
  try {
    console.log({ user: req.user });
    // look up users meal object
    const existingMeal = await Meal.findOne({
      owner: new ObjectId(req.user._id),
    });
    console.log({ existingMeal });
    // if it does not exist create it
    if (existingMeal === null) {
      const newMeal = await Meal.create({
        owner: req.user._id,
        type: "default",
      });
      console.log({ newMeal });
    }

    // look up item from nix

    const item_id = req.body.item_id;

    const nixItemResponse = await nutritionix.get(
      `/search/item?nix_item_id=${item_id}`
    );

    console.log({ nixItemResponse });
    // create a meal item and associate it with the meal using objectId
    const newMealItem = await MealItem.create({
      owner: req.user._id,
      meal: existingMeal !== null ? existingMeal._id : newMeal._id,
      nix_meta_data: { ...nixItemResponse?.data?.foods?.[0] },
      qty: 1,
    });

    res.json({ ...newMealItem });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

router.get("/meal_summary", requireToken, async (req, res, next) => {
  try {
    const items = await MealItem.find({
      owner: new ObjectId(req.user._id),
    });
    const total_calories = items.reduce((acc, item) => {
      const calories = item.nix_meta_data?.nf_calories
        ? item.nix_meta_data?.nf_calories
        : 0;
      return acc + calories * item.qty;
    }, 0);
    const total_carbs = items.reduce((acc, item) => {
      const carbs = item.nix_meta_data?.nf_total_carbohydrate
        ? item.nix_meta_data?.nf_total_carbohydrate
        : 0;
      return acc + carbs * item.qty;
    }, 0);

    const total_fats = items.reduce((acc, item) => {
      const fats = item.nix_meta_data?.nf_total_fat
        ? item.nix_meta_data?.nf_total_fat
        : 0;
      return acc + fats * item.qty;
    }, 0);

    const total_protein = items.reduce((acc, item) => {
      const protein = item.nix_meta_data?.nf_protein
        ? item.nix_meta_data?.nf_protein
        : 0;
      return acc + protein * item.qty;
    }, 0);
    res.json({ items, total_calories, total_carbs, total_protein, total_fats });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

router.delete(
  "/delete_item_from_meal",
  requireToken,
  async (req, res, next) => {
    try {
      const deletedItem = await MealItem.deleteOne({
        _id: new ObjectId(req.query.item_id),
      });
      res.json({ deletedItem });
    } catch (error) {
      console.error(error);
      res.json(error);
    }
  }
);

router.put("/edit_item_in_meal", requireToken, async (req, res, next) => {
  try {
    const editedItem = await MealItem.updateOne(
      { _id: new ObjectId(req.body.item_id) }, // <-- find stage
      {
        $set: {
          // <-- set stage
          qty: Number(req.body.qty),
        },
      }
    );
    res.json({ editedItem });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

module.exports = router;
