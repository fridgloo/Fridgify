"use strict";
let Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const quantity = require("../../model/quantity");
const fridge = require("../../model/fridge");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

module.exports = (app) => {
  // create recipe
  app.post("/v1/recipe/edit/:recipeId?", async (req, res) => {
    try {
      // NOTE: multiple recipes of same name can exist
      const recipeId = req.params.recipeId;
      // make recipe first without items. need to have it for tying relationships.
      let newRecipe = {
        name: req.body.name,
        created: Date.now(),
        instructions: req.body.instructions,
        cuisine: req.body.cuisine,
        // img
        items: [],
      };

      let recipe;
      if (recipeId) {
        recipe = await app.models.Recipe.findOneAndUpdate(
          { _id: recipeId },
          newRecipe
        );
      } else {
        recipe = new app.models.Recipe(newRecipe);
        await recipe.save();
      }
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
          recipe_id: recipeId ? recipeId : recipe._id,
          item_idx_id: itemIdx_id,
          quantity_val: item.val,
          quantity: quantCheck._id,
        };

        const recipe_item_idx_check = await app.models.Recipe_Item_Idx.findOne({
          item_idx_id: itemIdx_id,
          recipe_id: recipeId ? recipeId : recipe._id,
        });

        let recipe_Item_Idx;
        if (recipe_item_idx_check) {
          recipe_Item_Idx = await app.models.Recipe_Item_Idx.findOneAndUpdate(
            {
              _id: recipe_item_idx_check._id,
            },
            newRecipe_Item_Idx
          );
        } else {
          recipe_Item_Idx = new app.models.Recipe_Item_Idx(newRecipe_Item_Idx);
          await recipe_Item_Idx.save();
        }
        recipe_item_idx_ids.push(recipe_Item_Idx._id);
      }
      // Update recipe with the new Ids : `recipe_item_idx_ids`
      await app.models.Recipe.findOneAndUpdate(
        { _id: recipeId ? recipeId : recipe._id },
        { items: recipe_item_idx_ids }
      );
      const currentRecipe = await app.models.Recipe.findOne({
        _id: recipeId ? recipeId : recipe._id,
      });
      res.status(201).send(currentRecipe);
    } catch (err) {
      console.log(err);
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
    // ^ not implemented...............

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
  app.get("/v1/recipe/checkMissingItems/:recipeId", async (req, res) => {
    const recipeId = req.params.recipeId;
    const token = req.header("x-auth-token");

    try {
      jwt.verify(token, "secretkey", async (err, decoded) => {
        if (err) {
          res.status(400).send(err);
          return;
        }

        // valid user
        const user_obj = decoded.user;
        const user_fridges = await app.models.Fridge.find({
          owner: user_obj._id,
        });

        let user_fridge_ids = [];
        user_fridges.forEach((fridge) => {
          user_fridge_ids.push(fridge._id);
        });

        const recipe_item_query_res = await app.models.Recipe_Item_Idx.find({
          recipe_id: recipeId,
        })
          .select({ item_idx_id: 1 })
          .populate("item_idx_id");

        const fridge_query_res = await app.models.Item.find({
          fridge: { $in: user_fridge_ids },
        });

        // filter based on string names. must be perfect match: broccoli =/- broccolis
        // returns a list of recipe ingredients that users do not have in fridge
        var filtered_res = recipe_item_query_res.filter(function (o1) {
          return !fridge_query_res.some(function (o2) {
            return o1.item_idx_id.name === o2.name;
          });
        });

        res.status(200).send(filtered_res);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  app.get("/v1/recipe/image/:recipeId", async (req, res) => {
    try {
      res.sendFile(
        path.resolve(`public/recipe_images/${req.params.recipeId}.png`)
      );
    } catch (err) {
      res.status(400).send(err);
    }
  });

  const upload = multer({
    dest: path.resolve("public/multer_upload"),
    fileSize: 1000000,
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

  // upload image
  app.post(
    "/v1/recipe/image/upload/:recipeId",
    upload.single("image" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
      try {
        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
          fs.rename(
            tempPath,
            path.resolve(`public/recipe_images/${req.params.recipeId}.png`),
            (err) => {
              if (err) {
                res.status(400).send(err);
              }
              res.status(200).contentType("file").end("File uploaded!");
            }
          );
        } else {
          fs.unlink(tempPath, (err) => {
            if (err) return handleError(err, res);

            res
              .status(403)
              .contentType("text/plain")
              .end("Only .png files are allowed!");
          });
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  );

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
