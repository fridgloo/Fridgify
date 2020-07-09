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
        { _id: recipe._id },
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

  // abstract the detailed work
  async function expandRecipe(recipeObj) {
    let cleanedRes = [];
    let recipes = recipeObj;
    for (let recipe of recipes) {
      let recipe_item_idx_list = [];
      for (let item_id of recipe.items) {
        let cleanedItemObj = {}; // _id, ing_name, quantity, unit
        const recipe_item_idx_res = await app.models.Recipe_Item_Idx.findOne({
          _id: item_id,
        });

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
    return cleanedRes;
  }

  // abstract the names only work
  function simplifyRecipe(recipeObj) {
    let cleanedRes = [];
    let recipes = recipeObj;
    for (let recipe of recipes) {
      cleanedRes.push({ name: recipe.name, _id: recipe._id });
    }
    return cleanedRes;
  }

  app.get("/v1/recipe/view/:recipeId/:viewSetting?", async (req, res) => {
    try {
      const viewSetting = req.params.viewSetting;
      const recipeId = req.params.recipeId;
      let recipes;

      if (recipeId === "all") {
        recipes = await app.models.Recipe.find({});
      }
      if (recipeId !== "all") {
        recipes = await app.models.Recipe.find({ _id: recipeId });
      }
      if (viewSetting === undefined || viewSetting === "default") {
        res.status(200).send(recipes);
      }
      if (viewSetting === "detailed") {
        const finalRes = await expandRecipe(recipes);
        res.status(200).send(finalRes);
      }
      if (viewSetting === "namesOnly") {
        const finalRes = simplifyRecipe(recipes);
        res.status(200).send(finalRes);
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "recipe.get failed", message: err });
    }
  });

  // get recipe by name
  app.get(
    "/v1/recipe/view/name/:recipeName/:viewSetting?",
    async (req, res) => {
      try {
        const viewSetting = req.params.viewSetting;
        const recipeName = req.params.recipeName;
        let recipes = await app.models.Recipe.find({ name: recipeName });

        if (viewSetting === undefined || viewSetting === "default") {
          res.status(200).send(recipes);
        }
        if (viewSetting === "detailed") {
          const finalRes = await expandRecipe(recipes);
          res.status(200).send(finalRes);
        }
        if (viewSetting === "namesOnly") {
          const finalRes = simplifyRecipe(recipes);
          res.status(200).send(finalRes);
        }
      } catch (err) {
        console.log(err);
        res.status(400).send({ error: "recipe.get failed", message: err });
      }
    }
  );

  // get recipe by ingredient
  app.post("/v1/recipe/view/:viewSetting?", async (req, res) => {
    const item_names = req.body.item_names;
    const viewSetting = req.params.viewSetting;
    // ingredient order [ highest --> lowest priority]

    // doesnt have to match all specified.
    // get the itemIdx id from names.
    // if itemIdx doesn't exist ignore

    try {
      let item_idx_list = [];
      for (let i in item_names) {
        const item_idx = await app.models.Item_Idx.findOne({
          name: item_names[i],
        });
        // ignore if null
        if (item_idx) {
          item_idx_list.push(item_idx._id);
        }
      }
      // aggregate
      const ranked_recipe_search_results = await app.models.Recipe_Item_Idx.aggregate(
        [
          { $match: { item_idx_id: { $in: item_idx_list } } }, // get recipe_item_idx instance where at item matches
          { $sortByCount: "$recipe_id" }, // group/sort the results by how often the recipe_id shows up
          {
            $lookup: {
              // *join to connect grouped id from above result
              from: "recipes",
              localField: "_id",
              foreignField: "_id",
              as: "recipe",
            },
          },
          { $unwind: "$recipe" }, // unfold the object and display the info
        ]
      );

      if (viewSetting === "namesOnly") {
        let cleanedRes = [];
        for (let idx in ranked_recipe_search_results) {
          cleanedRes.push({
            _id: ranked_recipe_search_results[idx]._id,
            recipe_name: ranked_recipe_search_results[idx].recipe.name,
            count: ranked_recipe_search_results[idx].count,
          });
        }
        res.status(200).send(cleanedRes);
        return;
      }
      res.status(200).send(ranked_recipe_search_results);
    } catch (err) {
      res.status(400).send({ error: "recipe.get failed", message: err });
    }
  });

  // check what ingredients from recipe the user doesn't have.
  // specific / separate endpoint to not waste time on multiple recipes.
  // { -----------------------------
  // get user fridge items
  // find item_idx equivalent
  // maybe we should implement item revision before?
  // build array of ^
  // cross check against recipe items
  // return missing item list
  // ----------------------------- }

  // edit recipe
  // { -----------------------------
  // find recipe
  // find recipe_item_idx
  // update ^
  // return
  // ----------------------------- }

  // delete recipe
  // { -----------------------------
  // delete recipe item idx
  // delete recipe
  // return
  // ----------------------------- }
};
