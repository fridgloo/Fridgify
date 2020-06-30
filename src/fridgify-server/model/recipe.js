"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Recipe Model *******************/
[];

let Recipe = new Schema({
  name: { type: String },
  created: { type: Date },
  instruction: { type: String }, // save as entire HTML string with tags for formatting. ex: <html><p> add soy sauce </p> <p>add onions </p></html>
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }], // ingredients
  cuisine: { type: String },
  img: { data: Buffer, contentType: String }, // https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose
});

Recipe.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Recipe", Recipe);
