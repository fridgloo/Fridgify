import client from "./client";

const endpoint = "/fridge";

const getFridges = (token) => client.get(endpoint + "/" + token);

export const addFridge = (fridgeName, token) => {
  const obj = { name: fridgeName };
  const data = JSON.stringify(obj);
  return client.post(endpoint + "/" + token, data);
};

export default {
  addFridge,
  getFridges,
};
