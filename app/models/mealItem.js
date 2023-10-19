const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema(
  {
    nix_meta_data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    qty: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MealItem", mealItemSchema);
