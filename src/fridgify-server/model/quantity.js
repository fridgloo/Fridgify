"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Item Model *******************/
[];

// this is an external look up schema.
// users do not have CRUD access.
// if reading Decimal128 becomes a problem:
// https://stackoverflow.com/questions/53369688/extract-decimal-from-decimal128-with-mongoose-mongodb

// example usage.
// 4 lb
// to find out how much to subtract for recipe feature,
// find the instance for (lbs) stored as weight_unit.
// multiply by multiplier to find the new weight
// Universally storing amount in gram is useful for calculating such
// when items are stored in all types of units.

let Quantity = new Schema({
  multiplier_to_gram: { type: mongoose.Types.Decimal128, required: true },
  weight_unit: { type: String, required: true },
});

Item.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Item", Item);
