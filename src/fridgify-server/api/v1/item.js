"use strict";
let Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  /**
   * Create grocery item from fridge
   *
   */
  app.post("/v1/item/fridge/:token", async (req, res) => {
    // Try to create the item
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        if (err) {
          return res
            .status(400)
            .send({ error: "item.fridge.post jwt verify error" });
        }
        const newItem = {
          fridge: req.body.fridge,
          name: req.body.data.name,
          bought_date: req.body.data.bought_date,
          exp_date: req.body.data.exp_date,
          type: req.body.data.type,
          note: req.body.data.note
        };
        let item = new app.models.Item(newItem);
        await item.save();
        const query = { $push: { items: item._id } };
        await app.models.Fridge.updateOne({ _id: req.body.fridge }, query);
        res.status(201).send({
          id: item._id,
          name: item.name,
          bought_date: item.bought_date,
          exp_date: item.exp_date,
          type: item.type,
          note: item.note
        });
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "item.fridge.post failed" });
    }
  });

  /**
   * Get the grocery items in fridge
   *
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get("/v1/item/fridge/:id/:token", async (req, res) => {
    try {
      jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
        if (err) {
          return res.status(400).send({ error: "item.fridge.get jwt verify error" });
        }
        const fridge = await app.models.Fridge.findOne({
          _id: req.params.id,
        });

        const items = await app.models.Item.find({ fridge: fridge._id });
        // If not found, return 401:unauthorized
        if (!items) {
          return res.status(404).send({ error: "item.fridge.get - items not found" });
        }
        // If found, compare hashed passwords
        else {
          res.status(200).send({
            items: items,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "item.fridge.get failed" });
    }
  });
}
