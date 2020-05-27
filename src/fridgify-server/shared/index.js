"use strict";

const validPassword = (password) => {
  if (!password || password.length < 8) {
    return { error: "Password length must be > 7" };
  } else if (!password.match(/[0-9]/i)) {
    return { error: "Password must contain a number" };
  } else if (!password.match(/[a-z]/)) {
    return { error: "Password must contain a lowercase letter" };
  } else if (!password.match(/\@|\!|\#|\$|\%|\^/i)) {
    return { error: "Password must contain @, !, #, $, % or ^" };
  } else if (!password.match(/[A-Z]/)) {
    return { error: "Password must contain an uppercase letter" };
  }
  return undefined;
};

const validUsername = (username) => {
  if (!username || username.length <= 2 || username.length >= 16) {
    return { error: "Username length must be > 2 and < 16" };
  } else if (!username.match(/^[a-z0-9]+$/i)) {
    return { error: "Username must be alphanumeric" };
  }
  return undefined;
};

module.exports = {
  validPassword: validPassword,
  validUsername: validUsername,
};
