// "use strict";

// const path = require("path");
// const fs = require("fs");
// const express = require("express");
// const bodyParser = require("body-parser");
// const logger = require("morgan");
// const session = require("express-session");
// const mongoose = require("mongoose");
// const envConfig = require("simple-env-config");

// const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

// /**********************************************************************************************************/

// const setupServer = async () => {
//   // Get the app config
//   const conf = await envConfig("./config/config.json", env);
//   const port = process.env.PORT ? process.env.PORT : conf.port;

//   // Setup our Express pipeline
//   let app = express();
//   if (env !== "test") app.use(logger("dev"));
//   app.engine("pug", require("pug").__express);
//   app.set("views", __dirname);
//   app.use(express.static(path.join(__dirname, "../../public")));
//   // Setup pipeline session support
//   app.store = session({
//     name: "session",
//     secret: "grahamcardrules",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       path: "/",
//     },
//   });
//   app.use(app.store);
//   // Finish with the body parser
//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(bodyParser.json());

//   // Connect to MongoDB
//   try {
//     // Dont want to see MongooseJS deprecation warnings
//     mongoose.set("useNewUrlParser", true);
//     mongoose.set("useFindAndModify", false);
//     mongoose.set("useCreateIndex", true);
//     mongoose.set("useUnifiedTopology", true);
//     // Connect to the DB server
//     await mongoose.connect(conf.mongodb);
//     console.log(`MongoDB connected: ${conf.mongodb}`);
//   } catch (err) {
//     console.log(err);
//     process.exit(-1);
//   }

//   // Import our Data Models
//   app.models = {
//     Game: require("./models/game"),
//     Move: require("./models/move"),
//     User: require("./models/user"),
//   };

//   // Import our routes
//   require("./api")(app);

//   // Give them the SPA base page
//   app.get("*", (req, res) => {npm
//     const user = req.session.user;
//     console.log(`Loading app for: ${user ? user.username : "nobody!"}`);
//     let preloadedState = user
//       ? {
//           username: user.username,
//           first_name: user.first_name,
//           last_name: user.last_name,
//           primary_email: user.primary_email,
//           city: user.city,
//           games: user.games,
//         }
//       : {};
//     preloadedState = JSON.stringify(preloadedState).replace(/</g, "\\u003c");
//     res.render("base.pug", {
//       state: preloadedState,
//     });
//   });

//   // Run the server itself
//   let server = app.listen(port, () => {
//     console.log(`Assignment 5 ${env} listening on: ${server.address().port}`);
//   });
// };

// /**********************************************************************************************************/

// // Run the server
// setupServer();
