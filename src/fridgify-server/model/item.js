"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** User Model *******************/

let Item = new Schema({
    owner: { type: Schema.ObjectId, ref: "Fridge" },
    name: { type: String, required: true },
    bought: { type: Date, required: true},
    exp: { type: Date },
    true_exp: { type: Date }
});

User.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Item", Item);
