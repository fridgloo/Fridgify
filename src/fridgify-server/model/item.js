"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


/***************** Item Model *******************/
[ ]

let Item = new Schema({
    fridge_id: { type: Schema.ObjectId, ref: "Fridge" },
    name: { type: String, required: true },
    //quantity: { type: [Quantity] },
    bought_date: { type: Date, required: true},
    exp_date: { type: Date },
    note: { type: String }
});

Item.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Item", Item);
