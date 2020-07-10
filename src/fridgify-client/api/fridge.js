import client from "./client";

const endpoint = "/fridge";

const getFridges = () => client.get(endpoint);

const getFridgeById = (fridgeId) => client.get(`${endpoint}/id/${fridgeId}`);

export const addFridge = (fridgeName) => {
  return client.post(endpoint, fridgeName);
};

export const deleteFridge = (fridgeId) => {
  return client.delete(endpoint, {}, fridgeId);
};

export const editFridge = (fridgeId) => {
  const obj = { data: { primary: true }, _id: fridgeId };
  return client.put(endpoint, obj);
};

export default {
  getFridges,
  getFridgeById,
  addFridge,
  deleteFridge,
  editFridge,
};
