"use strict";
let Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  /**
   * Create a fridge
   *
   */
  app.post("/v1/fridge/:token", async (req, res) => {
    // TODO: Try to add more validation / type check / error check

    // Try to create the fridge
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        if (err) {
          return res
            .status(400)
            .send({ error: "fridge.post jwt verify error" });
        }
        const fridgeCheck = await app.models.Fridge.findOne({
          name: req.body.name,
        });
        if (fridgeCheck) {
          return res.status(400).send({ error: "Fridge name already used" });
        }

        let newFridge = {
          owner: decoded.user._id,
          name: req.body.name,
          created: Date.now(),
          items: [],
        };
        const user = await app.models.User.findOne({
          username: decoded.user.username,
        });
        if (user.fridges.length === 0) {
          newFridge["primary"] = true;
        }

        let fridge = new app.models.Fridge(newFridge);
        await fridge.save();
        const query = { $push: { fridges: fridge._id } };
        await app.models.User.updateOne({ _id: decoded.user._id }, query);
        res.status(201).send({
          id: fridge._id,
          name: fridge.name,
          created: fridge.created,
          items: fridge.items,
          primary: fridge.primary,
        });
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "fridge.post failed" });
    }
  });

  /**
   * Get the fridge by id
   *
   */
  app.get("/v1/fridge/id/:id", async (req, res) => {
    try {
      // Search database for item
      const fridge = await app.models.Fridge.findById(req.params.id);
      // If not found, return 401:unauthorized
      if (!fridge) {
        res.status(404).send({ error: "fridge.get - Fridge not found" });
      }
      // If found, compare hashed passwords
      else {
        res.status(200).send({
          name: fridge.name,
          created: fridge.created,
          items: fridge.items,
          primary: fridge.primary,
        });
      }
    } catch (err) {
      res.status(400).send({ error: "fridge.get failed" });
    }
  });

  /**
   * Get the fridges from token
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get("/v1/fridge/:token", async (req, res) => {
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        if (err) {
          return res.status(400).send({ error: "fridge.get jwt verify error" });
        }
        const user = await app.models.User.findOne({
          username: decoded.user.username,
        });

        const fridges = await app.models.Fridge.find({ owner: user._id });
        // If not found, return 401:unauthorized
        if (!fridges) {
          return res
            .status(404)
            .send({ error: "fridge.get - Fridge not found" });
        }
        // If found, compare hashed passwords
        else {
          res.status(200).send({
            fridges: fridges,
          });
        }
      });
    } catch (err) {
      res.status(400).send({ error: "fridge.get failed" });
    }
  });

  /**
   * Delete the fridge
   */
  app.delete("/v1/fridge/:token", async (req, res) => {
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        await app.models.User.updateOne(
          { _id: decoded.user._id },
          { $pull: { fridges: req.body.id } }
        );
        const fridge = await app.models.Fridge.findOneAndDelete({
          _id: req.body.id,
        });
        if (fridge.primary) {
          const fridges = await app.models.Fridge.find({
            owner: decoded.user._id,
          });
          if (fridges.length !== 0) {
            await app.models.Fridge.updateOne(
              { _id: fridges[0]._id },
              { primary: true }
            );
          }
        }
        res.status(200).end();
      });
    } catch (err) {
      res.status(400).send({ error: "fridge.get failed" });
    }
  });

  /**
   * Edit the fridge
   *
   */
  // app.put("/v1/fridge/:token")
};
