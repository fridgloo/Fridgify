"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/***************** Glist Model *******************/
[ ]

let Glist = new Schema({
    owner: { type: Schema.ObjectId, ref: "User", required: true },
    name: { type: String },
    created: { type: Date },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }]
});

Glist.pre("validate", function (next) {
  next();
});

module.exports = mongoose.model("Glist", Glist);
