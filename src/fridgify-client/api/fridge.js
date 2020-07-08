import client from "./client";

const endpoint = "/fridge";

const getFridges = (token) => {
  return client.get(`${endpoint}/${token}`);
};

const getFridgeById = (fridgeId) => client.get(`${endpoint}/id/${fridgeId}`);

export const addFridge = (fridgeName, token) => {
  return client.post(`${endpoint}/${token}`, fridgeName);
};

export const deleteFridge = (fridgeId, token) => {
  const obj = { data: { _id: fridgeId } };
  return client.delete(`${endpoint}/${token}`, {}, obj);
};

export const editFridge = (data, token) => {
  return client.put(`${endpoint}/${token}`, data);
};

export default {
  getFridges,
  getFridgeById,
  addFridge,
  deleteFridge,
  editFridge,
};
