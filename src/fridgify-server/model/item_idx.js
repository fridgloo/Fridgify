"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Item_Idx Model *******************/
[];

let Item_Idx = new Schema({
  name: { type: String, required: true },
});

Item_Idx.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Item_Idx", Item_Idx);
