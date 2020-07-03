"use strict";
let Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  /**
   * Create a fridge
   *
   */
  app.post("/v1/recipe", async (req, res) => {
    // Try to create the fridge
    try {
      // NOTE: multiple recipes of same name can exist
      // const recipeCheck = await app.models.Recipe.findOne({
      //   name: req.body.name.toLowerCase()
      // });

      // find and get item id

      for (const item of req.body.items) {
        const itemCheck = await app.models.Item.findOne({
          name: item.toLowerCase(),
        });
        console.log(itemCheck);
      }

      return;

      let newRecipe = {
        name: req.body.name,
        created: Date.now(),
        instructions: req.body.instructions,
        cuisine: req.body.cuisine,
        // img
        items: [],
      };

      let recipe = new app.models.Fridge(newRecipe);
      await recipe.save();
      const query = { $push: { fridges: recipe._id } };
      await app.models.User.updateOne({ _id: decoded.user._id }, query);
      res.status(201).send({
        _id: recipe._id,
        name: recipe.name,
        created: recipe.created,
        items: recipe.items,
        primary: recipe.primary,
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
  // app.get("/v1/fridge/id/:id", async (req, res) => {
  //   try {
  //     // Search database for item
  //     const fridge = await app.models.Fridge.findById(req.params.id);
  //     // If not found, return 401:unauthorized
  //     if (!fridge) {
  //       res.status(404).send({ error: "fridge.get - Fridge not found" });
  //     }
  //     // If found, compare hashed passwords
  //     else {
  //       res.status(200).send({
  //         name: fridge.name,
  //         created: fridge.created,
  //         items: fridge.items,
  //         primary: fridge.primary,
  //       });
  //     }
  //   } catch (err) {
  //     res.status(400).send({ error: "fridge.get failed" });
  //   }
  // });

  // /**
  //  * Get the fridges from token
  //  *
  //  * @param {req.body.name} Username of user trying to log in
  //  * @return { 200, {username, primary_email} }
  //  */
  // app.get("/v1/fridge/:token", async (req, res) => {
  //   try {
  //     jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
  //       if (err) {
  //         return res.status(400).send({ error: "fridge.get jwt verify error" });
  //       }
  //       const user = await app.models.User.findOne({
  //         username: decoded.user.username,
  //       });

  //       const fridges = await app.models.Fridge.find({ owner: user._id });
  //       // If not found, return 401:unauthorized
  //       if (!fridges) {
  //         return res
  //           .status(404)
  //           .send({ error: "fridge.get - Fridge not found" });
  //       }
  //       // If found, compare hashed passwords
  //       else {
  //         res.status(200).send({
  //           fridges: fridges,
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     res.status(400).send({ error: "fridge.get failed" });
  //   }
  // });

  // /**
  //  * Delete the fridge
  //  */
  // app.delete("/v1/fridge/:token", async (req, res) => {
  //   try {
  //     jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
  //       if (err) {
  //         return res
  //           .status(400)
  //           .send({ error: "fridge.delete jwt verify error" });
  //       }

  //       await app.models.User.updateOne(
  //         { _id: decoded.user._id },
  //         { $pull: { fridges: req.body._id } }
  //       );
  //       const fridge = await app.models.Fridge.findOneAndDelete({
  //         _id: req.body._id,
  //       });
  //       if (fridge.primary) {
  //         const fridges = await app.models.Fridge.find({
  //           owner: decoded.user._id,
  //         });
  //         if (fridges.length !== 0) {
  //           await app.models.Fridge.updateOne(
  //             { _id: fridges[0]._id },
  //             { primary: true }
  //           );
  //         }
  //       }

  //       await app.models.Item.deleteMany({ fridge: req.body._id });
  //       res.status(200).end();
  //     });
  //   } catch (err) {
  //     res.status(400).send({ error: "fridge.get failed" });
  //   }
  // });

  // /**
  //  * Edit the fridge
  //  *
  //  */
  // app.put("/v1/fridge/:token", async (req, res) => {
  //   try {
  //     jwt.verify(req.params.token, "secretkey", async (err, decoded) => {
  //       if (err) {
  //         return res.status(400).send({ error: "fridge.put jwt verify error" });
  //       }
  //       const editElements = req.body.data;
  //       Object.keys(editElements).map(async (key, index) => {
  //         if (key === "primary") {
  //           await app.models.Fridge.findOneAndUpdate(
  //             { primary: true },
  //             { primary: false }
  //           );
  //         }
  //         await app.models.Fridge.updateOne(
  //           { _id: req.body._id },
  //           { $set: { [key]: editElements[key] } }
  //         );
  //       });
  //       return res.status(202).end();
  //     });
  //   } catch (err) {
  //     res.status(400).send({ error: "fridge.put failed " });
  //   }
  // });
};
