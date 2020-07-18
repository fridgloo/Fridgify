"use strict";

module.exports = (app) => {
  require("./v1/user")(app);
  require("./v1/auth")(app);
  require("./v1/fridge")(app);
  require("./v1/glist")(app);
  require("./v1/item")(app);
  require("./v1/recipe")(app);
};
