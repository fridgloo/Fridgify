import client from "./client";

const signIn = (username, password) =>
  client.post("/auth", { username, password });

export default {
  signIn,
};
