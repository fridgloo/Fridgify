"use strict";
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");

module.exports = (app) => {
  /**
   * Create grocery item from fridge
   *
   */
  app.post(
    "/v1/item/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      const newItem = {
        fridge: req.body.fridge,
        name: req.body.data?.name,
        bought_date: req.body.data?.bought_date,
        exp_date: req.body.data?.exp_date,
        type: req.body.data?.type,
        note: req.body.data?.note,
      };
      let item = new app.models.Item(newItem);
      await item.save();
      const query = { $push: { items: item._id } };
      await app.models.Fridge.updateOne({ _id: req.body.fridge }, query);
      res.status(201).send({
        item: item,
      });
    })
  );

  /**
   * Create grocery item from glist
   *
   */
  app.post(
    "/v1/item/glist",
    auth,
    asyncMiddleware(async (req, res) => {
      req.body.data.items.map(async (item) => {
        const newItemData = {
          glist: req.body.glist,
          name: item?.name,
          bought_date: item?.bought_date,
          exp_date: item?.exp_date,
          type: item?.type,
          note: item?.note,
        };
        let newItem = new app.models.Item(newItemData);
        await newItem.save();
        const query = { $push: { items: newItem._id } };
        await app.models.Glist.updateOne({ _id: req.body.glist }, query);
      });

      res.status(201).send({});
    })
  );

  /**
   * Get the grocery items in fridge
   *
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get("/v1/item/fridge/:id", async (req, res) => {
    const fridge = await app.models.Fridge.findOne({
      _id: req.params.id,
    });

    const items = await app.models.Item.find({ fridge: fridge._id });
    if (!items) {
      return res
        .status(404)
        .send({ error: "item.fridge.get - items not found" });
    } else {
      res.status(200).send({
        items: items,
      });
    }
  });

  /**
   * Get the grocery items in glist
   *
   *
   * @param {req.body.name} Username of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.get(
    "/v1/item/glist/:id",
    asyncMiddleware(async (req, res) => {
      const glist = await app.models.Glist.findOne({
        _id: req.params.id,
      });

      const items = await app.models.Item.find({ glist: glist._id });
      if (!items) {
        return res
          .status(404)
          .send({ error: "item.glist.get - items not found" });
      } else {
        res.status(200).send({
          items: items,
        });
      }
    })
  );

  /**
   * Edit the item
   *
   */
  app.put(
    "/v1/item",
    auth,
    asyncMiddleware(async (req, res) => {
      const editElements = req.body.data;
      Object.keys(editElements).map(async (key, index) => {
        await app.models.Item.updateOne(
          { _id: req.body._id },
          { $set: { [key]: editElements[key] } }
        );
      });
      const item = await app.models.Item.findById(req.body._id);
      return res.status(202).send({ item: item });
    })
  );

  /**
   * Delete the item(s) from fridge
   */
  app.delete(
    "/v1/item/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      req.body.items.map(async (item) => {
        await app.models.Fridge.updateOne(
          { _id: req.body.fridge },
          { $pull: { items: item._id } }
        );
        await app.models.Item.deleteOne({
          _id: item._id,
        });
      });

      res.status(200).end();
    })
  );

  /**
   * Delete the item(s) from glist
   */
  app.delete(
    "/v1/item/glist",
    auth,
    asyncMiddleware(async (req, res) => {
      req.body.items.map(async (item) => {
        await app.models.Glist.updateOne(
          { _id: req.body.glist },
          { $pull: { items: item._id } }
        );
        await app.models.Item.deleteOne({
          _id: item._id,
        });
      });
      res.status(200).end();
    })
  );
};
