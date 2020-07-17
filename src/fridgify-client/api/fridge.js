import client from "./client";

const endpoint = "/fridge";

const getFridges = () => client.get(endpoint);

const getFridgeById = (fridgeId) => client.get(`${endpoint}/id/${fridgeId}`);

//Probably easier to just make the object here?
export const addFridge = (fridgeName) => {
  return client.post(endpoint, fridgeName);
};

export const deleteFridge = (fridgeId) => {
  const obj = { data: fridgeId };
  return client.delete(endpoint, {}, obj);
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
