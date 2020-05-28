const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3200;

const setupServer = async () => {

  let app = express();

  app.use(cors());
  // middleware
  app.use(cors({ origin: "http://localhost:19006" }));

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
    await mongoose.connect("mongodb://localhost:32768");
    console.log(`MongoDB connected: mongodb://localhost:32768`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  // Import our Data Models
  app.models = {
    User: require("./model/user"),
  };

  // Import our routes
  require("./api")(app);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "FRIDGIFY SERVER WORKS" });
  });

  let server = app.listen(port, () => {
    console.log(`running at port ${server.address().port}`);
  });
};

/*************************************************************************/

// Run the server
setupServer();
