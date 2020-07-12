"use strict";
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");

module.exports = (app) => {
  /**
   * Create a glist
   *
   */
  app.post(
    "/v1/glist",
    auth,
    asyncMiddleware(async (req, res) => {
      // TODO: Try to add more validation / type check / error check
      const glistCheck = await app.models.Glist.findOne({
        name: req.body.name.toLowerCase(),
        owner: req.user._id,
      });
      if (glistCheck) {
        console.log("error: glist name already used");
        return res.status(400).send({ error: "Glist name already used" });
      }

      let newGlist = {
        owner: req.user._id,
        name: req.body.name,
        created: Date.now(),
        items: [],
      };

      let glist = new app.models.Glist(newGlist);
      await glist.save();
      const query = { $push: { glists: glist._id } };
      await app.models.User.updateOne({ _id: req.user._id }, query);
      res.status(201).send({
        _id: glist._id,
        name: glist.name,
        created: glist.created,
        items: glist.items,
      });
    })
  );

  /**
   * Get the glist by id
   *
   */
  app.get(
    "/v1/glist/id/:id",
    asyncMiddleware(async (req, res) => {
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
    })
  );

  /**
   * Get the glists
   *
   */
  app.get(
    "/v1/glist",
    asyncMiddleware(async (req, res) => {
      const user = await app.models.User.findOne({
        username: req.user.username,
      });

      const glists = await app.models.Glist.find({ owner: user._id });

      if (!glists) {
        return res.status(404).send({ error: "glist.get - Glist not found" });
      } else {
        res.status(200).send({
          glists: glists,
        });
      }
    })
  );

  /**
   * Delete the glist
   */
  app.delete(
    "/v1/glist",
    auth,
    asyncMiddleware(async (req, res) => {
      await app.models.User.updateOne(
        { _id: req.user._id },
        { $pull: { glists: req.body._id } }
      );
      await app.models.Glist.deleteOne({
        _id: req.body._id,
      });
      await app.models.Item.deleteMany({ glist: req.body._id });
      res.status(200).end();
    })
  );

  /**
   * Edit the glist
   *
   */
  app.put(
    "/v1/glist",
    auth,
    asyncMiddleware(async (req, res) => {
      const editElements = req.body.data;
      Object.keys(editElements).map(async (key, index) => {
        await app.models.Glist.updateOne(
          { _id: req.body._id },
          { $set: { [key]: editElements[key] } }
        );
      });
      return res.status(202).end();
    })
  );

  /**
   * Submit glist to fridge
   */
  app.put(
    "/v1/glist/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      req.body.items.map(async (item) => {
        await app.models.Item.updateOne(
          { _id: item._id },
          {
            $set: { glist: undefined, fridge: req.body.fridge },
          }
        );
        await app.models.Fridge.updateOne(
          { _id: req.body.fridge },
          {
            $push: { items: item._id },
          }
        );
        await app.models.Glist.updateOne(
          { _id: req.body.glist },
          {
            $pull: { items: item._id },
          }
        );
      });

      return res.status(202).end();
    })
  );
};
