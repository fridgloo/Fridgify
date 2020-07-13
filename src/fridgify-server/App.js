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
    Quantity: require("./model/quantity"),
  };

  // Import our routes
  require("./api")(app);

  async function initQuantity() {
    // fridge check length
    var resp;
    // await app.models.Quantity.deleteMany({}, function (err) {});
    // return;
    await app.models.Quantity.countDocuments({}, function (err, count) {
      console.log("[DEV]Quantity is:", count);
    });
    await app.models.Quantity.findOne({ symbol: "g" }, function (err, res) {
      resp = res;
    });
    if (resp != null) {
      return;
    }
    if (resp == null) {
      const arr = [
        { multiplier_to_gram: 1, weight_unit: "gram", symbol: "g" },
        { multiplier_to_gram: 1000, weight_unit: "kilogram", symbol: "kg" },
        { multiplier_to_gram: 453.59237, weight_unit: "pound", symbol: "lb" },
        { multiplier_to_gram: 28.3496, weight_unit: "ounce", symbol: "oz" },
        { multiplier_to_gram: 1000, weight_unit: "liter", symbol: "l" },
        {
          multiplier_to_gram: 3785.411784,
          weight_unit: "gallon",
          symbol: "gal",
        },
        { multiplier_to_gram: 946.352946, weight_unit: "quart", symbol: "qt" },
        { multiplier_to_gram: 200, weight_unit: "cup", symbol: "cup" },
      ];
      await app.models.Quantity.collection.insertMany(arr, function (
        error,
        docs
      ) {});
      return;
    }
  }

  await initQuantity();

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
