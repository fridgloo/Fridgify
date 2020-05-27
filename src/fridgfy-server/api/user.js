"use strict";

const Joi = require("@hapi/joi");
const { validPassword } = require("../shared");
const mongoose = require("mongoose");

module.exports = (app) => {
  /**
   * Create a new user
   *
   * @param {req.body.username} Display name of the new user
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @param {req.body.email} Email address of the user
   * @param {req.body.password} Password for the user
   * @return {201, {username, email}} Return username and others
   */
  app.post("/user", async (req, res) => {
    // Schema for user info validation
    let data;
    try {
      // Validate user input
      let schema = Joi.object().keys({
        username: Joi.string().lowercase().alphanum().min(3).max(32).required(),
        email: Joi.string().lowercase().email().required(),
        first_name: Joi.string().allow(""),
        last_name: Joi.string().allow(""),
        password: Joi.string().min(8).required(),
      });
      data = await schema.validateAsync(req.body);
    } catch (err) {
      const message = err.details[0].message;
      //console.log(`User.create validation failure: ${message}`);
      return res.status(400).send({ error: message });
    }

    // Deeper password validation
    const pwdErr = validPassword(data.password);
    if (pwdErr) {
      //console.log(`User.create password validation failure: ${pwdErr.error}`);
      return res.status(400).send(pwdErr);
    }

    // Try to create the user
    try {
      let user = new app.models.User(data);
      await user.save();
      // Send the happy response back
      res.status(201).send({
        username: data.username,
        email: data.email,
      });
    } catch (err) {
      // Error if username is already in use
      if (err.code === 11000) {
        if (err.message.indexOf("username_1") !== -1)
          res.status(400).send({ error: "username already in use" });
        if (err.message.indexOf("email_1") !== -1)
          res.status(400).send({ error: "email address already in use" });
      }
      // Something else in the username failed
      else res.status(400).send({ error: "invalid username" });
    }
  });

  /**
   * See if user exists
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200 || 404}
   */
  app.head("/user/:username", async (req, res) => {
    let user = await app.models.User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user)
      res.status(404).send({ error: `unknown user: ${req.params.username}` });
    else res.status(200).end();
  });

  /**
   * Fetch user information
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200, {username, primary_email, first_name, last_name}}
   */
  app.get("/user/:username", async (req, res) => {
    let user = await app.models.User.findOne({
      username: req.params.username.toLowerCase(),
    });

    if (!user)
      res.status(404).send({ error: `unknown user: ${req.params.username}` });
    else {
      res.status(200).send({
        username: user.username,
        primary_email: user.primary_email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    }
  });

  /**
   * Update a user's profile information
   *
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @return {204, no body content} Return status only
   */
  app.put("/user", async (req, res) => {
    // Ensure the user is logged in
    if (!req.session.user)
      return res.status(401).send({ error: "unauthorized" });

    let data;
    // Validate passed in data
    try {
      let schema = Joi.object().keys({
        first_name: Joi.string().allow(""),
        last_name: Joi.string().allow(""),
      });
      data = schema.validateAsync(req.body);
    } catch (err) {
      const message = err.details[0].message;
      console.log(`User.update validation failure: ${message}`);
      return res.status(400).send({ error: message });
    }

    // Update the user
    try {
      const query = { username: req.session.user.username };
      req.session.user = await app.models.User.findOneAndUpdate(
        query,
        { $set: data },
        { new: true }
      );
      res.status(204).end();
    } catch (err) {
      // console.log(
      //   `User.update logged-in user not found: ${req.session.user.id}`
      // );
      res.status(500).end();
    }
  });
};
