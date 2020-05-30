/* Copyright G. Hemingway, @2018 */
"use strict";

const fs = require("fs");

/*
 * Establish the configuration of the application
 *
 * @param configFile string - Path for the configuration file to be loaded
 * @param environment string - Profile name in configuration file to be loaded
 * @param flag string - Named portion of config file to look for configuration
 * @return Promise {config} The configuration for the given profile
 */
module.exports = async (
  configFile,
  environment = process.env ? process.env : "dev",
  flag = "environments"
) =>
  new Promise((resolve, reject) => {
    let config = {};
    try {
      config = JSON.parse(fs.readFileSync(configFile, "ascii"));
      config.env = environment;
      let env = config[flag][environment];
      delete config[flag];
      // Blend in the environment
      if (env) {
          Object.keys(env).forEach(key => {
            if (typeof env[key] !== "undefined") {
                if (typeof config[key] === "object") {
                    config[key] = Object.assign({}, config[key], env[key]);
                } else {
                    config[key] = env[key];
                }
            }
        });
      }
      // Done, return the config
      resolve(config);
    } catch (err) {
      reject(`envConfig Error: ${err}`);
    }
  });
