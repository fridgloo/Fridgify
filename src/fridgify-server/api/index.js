"use strict";

module.exports = (app) => {
  require("./v1/user")(app);
  require("./v1/auth")(app);
};
