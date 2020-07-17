"use strict";

const { validPassword } = require("../../util/Validation");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");

module.exports = (app) => {
  /**
   * Create a new user
   *
   * @param {req.body.username} Display name of the new user
   * @param {req.body.password} Password for the user
   * @param {req.body.email} Email address of the user
   * @return {201, {username, email}} Return username and others
   */
  app.post(
    "/v1/user",
    asyncMiddleware(async (req, res) => {
      const { error } = app.models.User.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      // Deeper password validation
      const pwdErr = validPassword(req.body.password);
      if (pwdErr) return res.status(400).send(pwdErr);

      let user = await app.models.User.findOne({
        username: req.body.username,
      });
      if (user) return res.status(400).send("Username already taken");

      user = await app.models.User.findOne({ email: req.body.email });
      if (user) return res.status(400).send("Email already in use");

      user = new app.models.User(req.body);

      // glist 0 as shopping cart
      const shopping_cart = {
        owner: user._id,
        name: user._id.toString(),
        created: Date.now(),
        items: [],
      };
      let glist = new app.models.Glist(shopping_cart);
      await glist.save();

      // default fridge
      let default_fridge = {
        owner: user._id,
        name: "Default",
        created: Date.now(),
        items: [],
      };
      let fridge = new app.models.Fridge(default_fridge);
      await fridge.save();

      user.glists = [glist._id];
      user.fridges = [fridge._id];
      await user.save();

      const token = user.generateAuthToken();

      res.header("x-auth-token", token).status(201).send({
        username: req.body.username,
        password: req.body.email,
      });
    })
  );

  /**
   * See if user exists
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200 || 404}
   */
  app.head("/v1/user/:username", async (req, res) => {
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
  app.get(
    "/v1/user/:username",
    auth,
    asyncMiddleware(async (req, res) => {
      let user = await app.models.User.findOne({
        username: req.params.username.toLowerCase(),
      });

      if (!user)
        res.status(404).send({ error: `unknown user: ${req.params.username}` });
      else {
        res.status(200).send({
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          fridges: user.fridges,
          glist: user.glists,
        });
      }
    })
  );

  /**
   * Update a user's profile information
   *
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @return {204, no body content} Return status only
   */
  // app.put("/v1/user", async (req, res) => {
  //   // Ensure the user is logged in
  //   if (!req.session.user)
  //     return res.status(401).send({ error: "unauthorized" });

  //   let data;
  //   // Validate passed in data
  //   try {
  //     let schema = Joi.object().keys({
  //       first_name: Joi.string().allow(""),
  //       last_name: Joi.string().allow(""),
  //     });
  //     data = schema.validateAsync(req.body);
  //   } catch (err) {
  //     const message = err.details[0].message;
  //     console.log(`User.update validation failure: ${message}`);
  //     return res.status(400).send({ error: message });
  //   }

  //   // Update the user
  //   try {
  //     const query = { username: req.session.user.username };
  //     req.session.user = await app.models.User.findOneAndUpdate(
  //       query,
  //       { $set: data },
  //       { new: true }
  //     );
  //     res.status(204).end();
  //   } catch (err) {
  //     // console.log(
  //     //   `User.update logged-in user not found: ${req.session.user.id}`
  //     // );
  //     res.status(500).end();
  //   }
  // });
};
