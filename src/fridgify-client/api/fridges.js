import client from "./client";

const endpoint = "/fridge";

const getFridges = () => client.get(endpoint);

export const addFridge = (fridgeName) => {
  const obj = { name: fridgeName };
  const data = JSON.stringify(obj);
  return client.post(endpoint, data);
};

export default {
  addFridge,
  getFridges,
};
