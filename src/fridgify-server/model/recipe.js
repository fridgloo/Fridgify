"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Recipe Model *******************/
[];

let Recipe = new Schema({
  name: { type: String, text: true },
  created: { type: Date },
  instructions: { type: String }, // save as entire HTML string with tags for formatting. ex: <html><p> add soy sauce </p> <p>add onions </p></html>
  items: [{ type: Schema.Types.ObjectId, ref: "Recipe_Item_Idx" }], // ingredients
  cuisine: { type: String },
  // maybe have an asset folder for storing images ?
  // and just make img the filepath to display
});

Recipe.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Recipe", Recipe);
