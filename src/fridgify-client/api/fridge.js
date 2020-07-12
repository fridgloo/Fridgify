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

export const editFridge = (data) => {
  return client.put(endpoint, data);
};

export default {
  getFridges,
  getFridgeById,
  addFridge,
  deleteFridge,
  editFridge,
};
