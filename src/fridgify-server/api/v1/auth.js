"use strict";
const jwt = require('jsonwebtoken');
let Joi = require("@hapi/joi");

module.exports = app => {
  /**
   * Log a user in
   *
   * @param {req.body.username} Username of user trying to log in
   * @param {req.body.password} Password of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.post("/v1/auth", async (req, res) => {
    // Validate incoming request has username and password, if not return 400:'username and password are required'
    let schema = Joi.object().keys({
      username: Joi.string()
        .lowercase()
        .required(),
      password: Joi.string().required()
    });
    try {
      let data = await schema.validateAsync(req.body);
      // Search database for user
      const user = await app.models.User.findOne({ username: data.username });
      // If not found, return 401:unauthorized
      if (!user) res.status(401).send({ error: "unauthorized" });
      // If found, compare hashed passwords
      else if (user.authenticate(data.password)) {
        // Regenerate session when signing in to prevent fixation
        // console.log(`Session.login success: ${req.session.user.username}`);
          // If a match, return 201:{ username, email }
          jwt.sign({ user }, 'secretkey', (err, token) => {
            res.status(200).send({
              token: token
            });
          })
          
      } else {
        // If not a match, return 401:unauthorized
        console.log(`Session.login failed.  Incorrect credentials.`);
        res.status(401).send({ error: "unauthorized" });
      }
    } catch (err) {
    //   console.log("here!")
    //   console.log(err)
      const message = err.details[0].message;
      console.log(`Session.login validation failure: ${message}`);
      res.status(400).send({ error: message });
    }
  });

  /**
   * Log a user out
   *
   * @return { 204 if was logged in, 200 if no user in session }
   */
  app.delete("/v1/auth", (req, res) => {
    if (req.session.user) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(200).end();
    }
  });
};
