"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Recipe_Item_Idx Model *******************/
[];

// relationship table
let Recipe_Item_Idx = new Schema({
  recipe_id: { type: Schema.ObjectId, ref: "Recipe" },
  item_id: { type: Schema.ObjectId, ref: "Item_Idx" },
  quantity_val: { type: mongoose.Types.Decimal128 },
  quantity: { type: Schema.ObjectId, ref: "Quantity" },
});

Recipe_Item_Idx.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Recipe_Item_Idx", Recipe_Item_Idx);
