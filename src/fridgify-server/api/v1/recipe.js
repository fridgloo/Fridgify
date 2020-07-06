"use strict";
let Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const quantity = require("../../model/quantity");

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

      // make recipe first without items. need to have it for tying relationships.
      let newRecipe = {
        name: req.body.name,
        created: Date.now(),
        instructions: req.body.instructions,
        cuisine: req.body.cuisine,
        // img
        items: [],
      };
      let recipe = new app.models.Recipe(newRecipe);
      await recipe.save();

      // ingredient_list ids
      let recipe_item_idx_ids = [];

      // find and get item id
      for (const item of req.body.items) {
        // check if item exists
        item.name = item.name.toLowerCase();
        const itemCheck = await app.models.Item_Idx.findOne({
          name: item.name,
        });

        let itemIdx_id;
        // if not make item
        if (itemCheck === null) {
          let newItemIdx = {
            name: item.name,
          };
          let itemIdx = new app.models.Item_Idx(newItemIdx);
          await itemIdx.save();
          itemIdx_id = itemIdx._id;
        } else {
          itemIdx_id = itemCheck._id;
        }

        // find quant instance id
        const quantCheck = await app.models.Quantity.findOne({
          symbol: item.unit,
        });
        // create `recipe_item_idx` instance with current item
        let newRecipe_Item_Idx = {
          recipe_id: recipe._id,
          item_idx_id: itemIdx_id,
          quantity_val: item.val,
          quantity: quantCheck._id,
        };
        let recipe_Item_Idx = new app.models.Recipe_Item_Idx(
          newRecipe_Item_Idx
        );
        await recipe_Item_Idx.save();
        recipe_item_idx_ids.push(recipe_Item_Idx._id);
      }
      // Update recipe with the new Ids : `recipe_item_idx_ids`
      await app.models.Recipe.updateOne(
        { _id: savedRecipe_id },
        { items: recipe_item_idx_ids }
      );

      const currentRecipe = await app.models.Recipe.findOne({
        _id: recipe._id,
      });

      res.status(201).send(currentRecipe);
    } catch (err) {
      res.status(400).send({ error: "recipe.post failed", message: err });
    }
  });

  app.get("/v1/recipe/view/all/:viewSetting?", async (req, res) => {
    try {
      const viewSetting = req.params.viewSetting;

      let recipes = await app.models.Recipe.find({});
      if (viewSetting === undefined || viewSetting === "default") {
        res.status(200).send(recipes);
      }
      let cleanedRes = [];
      if (viewSetting === "detailed") {
        for (let recipe of recipes) {
          let recipe_item_idx_list = [];
          for (let item_id of recipe.items) {
            let cleanedItemObj = {}; // _id, ing_name, quantity, unit
            const recipe_item_idx_res = await app.models.Recipe_Item_Idx.findOne(
              {
                _id: item_id,
              }
            );

            // get ing_name
            const item_idx_res = await app.models.Item_Idx.findOne({
              _id: recipe_item_idx_res.item_idx_id,
            });
            const quantity_res = await app.models.Quantity.findOne({
              _id: recipe_item_idx_res.quantity,
            });

            cleanedItemObj = {
              recipe_item_idx_id: item_id,
              item_name: item_idx_res.name,
              quantity_val: Number(recipe_item_idx_res.quantity_val),
              quantity: quantity_res.symbol,
            };

            recipe_item_idx_list.push(cleanedItemObj);
          }
          let cleanedRecipe = {
            _id: recipe._id,
            name: recipe.name,
            created: recipe.created,
            instructions: recipe.instructions,
            cuisine: recipe.cuisine,
            items: recipe_item_idx_list,
          };
          cleanedRes.push(cleanedRecipe);
        }

        res.status(200).send(cleanedRes);
      }
      if (viewSetting === "namesOnly") {
        for (let recipe of recipes) {
          cleanedRes.push({ name: recipe.name, _id: recipe._id });
        }
        res.status(200).send(cleanedRes);
      }

      // res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "recipe.get failed", message: err });
    }
  });

  // get recipe by id

  // get recipe by ingredient

  // get recipe by name

  // edit recipe

  // delete recipe
};
