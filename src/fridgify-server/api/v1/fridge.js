"use strict";
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");

module.exports = (app) => {
  /**
   * Create a fridge
   *
   * @param {name of fridge}
   * @return {new fridge}
   */
  app.post(
    "/v1/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      const fridgeCheck = await app.models.Fridge.findOne({
        name: req.body.name.toLowerCase(),
        owner: req.user._id,
      });
      if (fridgeCheck) {
        console.log("error: fridge name already used");
        return res.status(400).send({ error: "Fridge name already used" });
      }

      const newFridge = {
        owner: req.user._id,
        name: req.body.name,
        created: Date.now(),
        items: [],
      };

      const user = await app.models.User.findOne({
        username: req.user.username,
      });

      if (user.fridges.length === 0) {
        newFridge["primary"] = true;
      }

      let fridge = new app.models.Fridge(newFridge);
      await fridge.save();
      const query = { $push: { fridges: fridge._id } };
      await app.models.User.updateOne({ _id: req.user._id }, query);
      res.status(201).send({
        _id: fridge._id,
        name: fridge.name,
        created: fridge.created,
        items: fridge.items,
        primary: fridge.primary,
      });
    })
  );

  /**
   * Get the fridge by id
   *
   */
  app.get(
    "/v1/fridge/id/:id",
    auth,
    asyncMiddleware(async (req, res) => {
      // Search database for item
      const fridge = await app.models.Fridge.findById(req.params.id);
      // If not found, return 401:unauthorized
      if (!fridge) {
        res.status(404).send({ error: "fridge.get - Fridge not found" });
      } else {
        res.status(200).send({
          name: fridge.name,
          created: fridge.created,
          items: fridge.items,
          primary: fridge.primary,
        });
      }
    })
  );

  /**
   * Get the fridges
   *
   * @return { fridges[Fridge Object] }
   */
  app.get(
    "/v1/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      const fridges = await app.models.Fridge.find({
        owner: req.user._id,
      }).sort("-primary");

      res.status(200).send(fridges);
    })
  );

  /**
   * Delete the fridge
   *
   * @param {fridge._id} id of fridge that will be deleted
   */
  app.delete(
    "/v1/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      await app.models.User.updateOne(
        { _id: req.user._id },
        { $pull: { fridges: req.body._id } }
      );
      const fridge = await app.models.Fridge.findOneAndDelete({
        _id: req.body._id,
      });
      if (fridge.primary) {
        const fridges = await app.models.Fridge.find({
          owner: req.user._id,
        });
        if (fridges.length !== 0) {
          await app.models.Fridge.updateOne(
            { _id: fridges[0]._id },
            { primary: true }
          );
        }
      }

      const result = await app.models.Item.deleteMany({
        fridge: req.body._id,
      });
      console.log(result);
      res.status(200).end();
    })
  );

  /**
   * Edit the fridge
   *
   */
  app.put(
    "/v1/fridge",
    auth,
    asyncMiddleware(async (req, res) => {
      const editElements = req.body.data;
      Object.keys(editElements).map(async (key, index) => {
        if (key === "primary") {
          await app.models.Fridge.findOneAndUpdate(
            { primary: true },
            { primary: false }
          );
        }
        await app.models.Fridge.updateOne(
          { _id: req.body._id },
          { $set: { [key]: editElements[key] } }
        );
      });
      return res.status(202).end();
    })
  );
};
