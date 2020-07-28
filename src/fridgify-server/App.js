const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const envConfig = require("simple-env-config");
const morgan = require("morgan");
const helmet = require("helmet");
const error = require("./middleware/error");
const notFound = require("./middleware/notFound");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

const setupServer = async () => {
  const conf = await envConfig("../../config/config.json", env);
  const port = process.env.PORT ? process.env.PORT : conf.port;

  // Setup our Express pipeline
  const app = express();

  app.use(helmet());

  app.use(cors());
  app.use(cors({ origin: `${conf.url}:${conf.expo_port}` }));

  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));

  if (env === "dev") {
    app.use(morgan("dev"));
    console.log("[DEV] Morgan Enabled");
  }

  // Connect to MongoDB
  try {
    // Dont want to see MongooseJS deprecation warnings
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useUnifiedTopology", true);
    // Connect to the DB server
    await mongoose.connect(conf.mongodb);
    console.log(`MongoDB connected: ${conf.mongodb}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  // Import our Data Models
  app.models = {
    User: require("./model/user"),
    Fridge: require("./model/fridge"),
    Item: require("./model/item"),
    Glist: require("./model/glist"),
    Recipe: require("./model/recipe"),
    Item_Idx: require("./model/item_idx"),
    Recipe_Item_Idx: require("./model/recipe_item_idx"),
  };

  // Import our routes
  require("./api")(app);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "FRIDGIFY SERVER WORKS" });
  });

  app.use(notFound);
  app.use(error);

  let server = app.listen(port, () => {
    console.log(`${env} listening on: ${server.address().port}`);
  });
};

/*************************************************************************/

// Run the server
setupServer();
