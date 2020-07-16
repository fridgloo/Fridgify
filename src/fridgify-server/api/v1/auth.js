"use strict";
const Joi = require("@hapi/joi");
const asyncMiddleware = require("../../middleware/async");

module.exports = (app) => {
  /**
   * Log a user in
   *
   * @param {req.body.username} Username of user trying to log in
   * @param {req.body.password} Password of user trying to log in
   * @return {token}
   */
  app.post(
    "/v1/auth",
    asyncMiddleware(async (req, res) => {
      const { error } = validate(req.body);

      if (error) return res.status(400).send(error.details[0].message);

      const user = await app.models.User.findOne({
        username: req.body.username,
      });

      if (!user)
        res.status(400).send({ error: "Invalid Username or Password." });
      else if (user.authenticate(req.body.password)) {
        const token = user.generateAuthToken();
        res.send(token);
      } else {
        console.log(`Login failed.  Incorrect credentials.`);
        res.status(400).send({ error: "Unauthorized" });
      }
    })
  );

  function validate(req) {
    const schema = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    return schema.validate(req);
  }
};
