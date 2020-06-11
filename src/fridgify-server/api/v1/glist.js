"use strict";
let Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  /**
   * Create a glist
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.post("/v1/glist/:token", async (req, res) => {
    // TODO: Try to add more validation / type check / error check

    // Try to create the item
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        if (err) {
          res.status(400).send({ error: "glist.post jwt verify error" });
        }
        let newGlist = {
          owner: decoded.user._id,
          name: req.body.name,
          created: Date.now(),
          items: [],
        };
        let glist = new app.models.Glist(newGlist);
        await glist.save();
        const query = { $push: { glists: glist._id } };
        await app.models.User.findByIdAndUpdate(decoded.user._id, query);
        res.status(201).send({
          id: glist._id,
          name: glist.name,
          created: glist.created,
          items: glist.items,
        });
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "glist.post failed" });
    }
  });

  /**
   * Get the glist by id
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get("/v1/glist/id/:id", async (req, res) => {
    try {
      // Search database for item
      const glist = await app.models.Glist.findById(req.params.id);
      // If not found, return 401:unauthorized
      if (!glist) {
        res.status(404).send({ error: "glist.get - Glist not found" });
      }
      // If found, compare hashed passwords
      else {
        res.status(200).send({
          name: glist.name,
          created: glist.created,
          items: glist.items,
        });
      }
    } catch (err) {
      res.status(400).send({ error: "glist.get failed" });
    }
  });

  /**
   * Get the glist from token
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get("/v1/glist/:token", async (req, res) => {
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        if (err) {
          res.status(400).send({ error: "glist.get jwt verify error" });
        }
        const user = await app.models.User.findOne({
          username: decoded.user.username,
        });

        const glist = await app.models.Glist.findById(
          { owner: user._id }
        );
        // If not found, return 401:unauthorized
        if (!glist) {
          res.status(404).send({ error: "glist.get - Glist not found" });
        }
        // If found, compare hashed passwords
        else {
          res.status(200).send({
            id: glist._id,
            name: glist.name,
            created: glist.created,
            items: glist.items,
          });
        }
      });
    } catch (err) {
      res.status(400).send({ error: "glist.get failed" });
    }
  });

  /**
   * Delete the glist
   */
  app.delete("/v1/glist/:token", async (req, res) => {
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        const query = { $pull: { glists: req.body.id } };
        await app.models.User.findByIdAndUpdate(decoded.user._id, query);
        await app.models.Glist.findByIdAndDelete(req.body.id);
        res.status(200).end();
      });
    } catch (err) {
      res.status(400).send({ error: "glist.get failed" });
    }
  });
};
