"use strict";
let Joi = require("@hapi/joi");

module.exports = (app) => {
  /**
   * Create grocery item
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.post("/v1/item", async (req, res) => {
    try {
      // Search database for user
      const item = await app.models.Item.findOne({ name: data.name });
      // If not found, return 401:unauthorized
      if (!item) {
        res.status(401).send({ error: "Item not found" });
      }
      // If found, compare hashed passwords
      else {
        res.status(200).send({
          name: item.name,
          exp_date: item.exp_date,
        });
      }
    } catch (err) {
      res.status(400).send({ error: "item.get failed" });
    }
  });

  /**
   * Get the grocery item
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get("/v1/item", async (req, res) => {
    try {
      // Search database for user
      const item = await app.models.Item.findOne({ name: data.name });
      // If not found, return 401:unauthorized
      if (!item) {
        res.status(401).send({ error: "Item not found" });
      }
      // If found, compare hashed passwords
      else {
        res.status(200).send({
          name: item.name,
          exp_date: item.exp_date,
        });
      }
    } catch (err) {
      res.status(400).send({ error: "item.get failed" });
    }
  });
};
