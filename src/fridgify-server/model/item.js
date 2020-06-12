"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Item Model *******************/
[ ]

let Item = new Schema({
    fridge: { type: Schema.ObjectId, ref: "Fridge" },
    glist: { type: Schema.ObjectId, ref: "Glist" },
    name: { type: String, required: true },
    //quantity: { type: [Quantity] },
    bought_date: { type: Date },
    exp_date: { type: Date },
    type: { type: String },
    note: { type: String }
});

Item.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Item", Item);
