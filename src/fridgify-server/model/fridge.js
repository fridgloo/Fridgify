"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Fridge Model *******************/
[];

const Fridge = new Schema({
  owner: { type: Schema.ObjectId, ref: "User", required: true },
  name: { type: String },
  created: { type: Date },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  primary: { type: Boolean, default: false },
});

Fridge.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Fridge", Fridge);
