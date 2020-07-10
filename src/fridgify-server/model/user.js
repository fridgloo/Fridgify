"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

/***************** User Model *******************/

const makeSalt = () => Math.round(new Date().valueOf() * Math.random()) + "";

const encryptPassword = (salt, password) =>
  crypto.createHmac("sha512", salt).update(password).digest("hex");

const reservedNames = ["password"];

const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  fridges: [{ type: Schema.Types.ObjectId, ref: "Fridge" }],
  glists: [{ type: Schema.Types.ObjectId, ref: "Glist" }],
});

userSchema.path("username").validate(function (value) {
  if (!value) return false;
  if (reservedNames.indexOf(value) !== -1) return false;
  return (
    value.length > 5 && value.length <= 16 && /^[a-zA-Z0-9]+$/i.test(value)
  );
}, "invalid username");

userSchema.path("email").validate(function (value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}, "malformed address");

userSchema.virtual("password").set(function (password) {
  this.salt = makeSalt();
  this.hash = encryptPassword(this.salt, password);
});

userSchema.method("authenticate", function (plainText) {
  return encryptPassword(this.salt, plainText) === this.hash;
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ user: this.user }, "secretkey");
  return token;
};

userSchema.pre("save", function (next) {
  // Sanitize strings
  this.username = this.username.toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

function validateUser(user) {
  const schema = Joi.object().keys({
    username: Joi.string().lowercase().alphanum().min(3).max(32).required(),
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.validate = validateUser;
