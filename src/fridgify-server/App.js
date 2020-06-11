const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const envConfig = require("simple-env-config");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

const setupServer = async () => {
  const conf = await envConfig("../../config/config.json", env);
  const port = process.env.PORT ? process.env.PORT : conf.port;

  // Setup our Express pipeline
  let app = express();

  app.use(cors());
  // middleware
  app.use(cors({ origin: `${conf.url}:${conf.expo_port}` }));

  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));

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
    Glist: require("./model/glist")
  };

  // Import our routes
  require("./api")(app);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "FRIDGIFY SERVER WORKS" });
  });

  let server = app.listen(port, () => {
    console.log(`${env} listening on: ${server.address().port}`);
  });
};

/*************************************************************************/

// Run the server
setupServer();
