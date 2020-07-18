import client from "./client";

const endpoint = "/item";
const itemFridgeEndpoint = "/item/fridge";
const itemGlistEndpoint = "/item/glist";

const getFridgeItems = (fridgeId) =>
  client.get(`${itemFridgeEndpoint}/${fridgeId}`);

const getGlistItems = (glistId) =>
  client.get(`${itemGlistEndpoint}/${glistId}`);

export const addFridgeItem = (data) => {
  return client.post(`${itemFridgeEndpoint}`, data);
};

export const addGlistItem = (data) => {
  return client.post(`${itemGlistEndpoint}`, data);
};

export const deleteFridgeItem = (data) => {
  const obj = { data: data };
  return client.delete(`${itemFridgeEndpoint}`, {}, obj);
};

export const deleteGlistItem = (data) => {
  const obj = { data: data };
  return client.delete(`${itemGlistEndpoint}`, {}, obj);
};

export const editItem = (data) => {
  return client.put(`${endpoint}`, data);
};

export default {
  getFridgeItems,
  getGlistItems,
  addFridgeItem,
  addGlistItem,
  deleteFridgeItem,
  deleteGlistItem,
  editItem,
};
