import client from "./client";

const endpoint = "/item";
const itemFridgeEndpoint = "/item/fridge";
const itemGlistEndpoint = "/item/glist";

export const getFridgeItems = (fridgeId, token) => {
  return client.get(`${itemFridgeEndpoint}/${fridgeId}/${token}`);
};

export const getGlistItems = (glistId, token) => {
  return client.get(`${itemGlistEndpoint}/${glistId}/${token}`);
};

export const addFridgeItem = (data, token) => {
  return client.post(`${itemFridgeEndpoint}/${token}`, data);
};

export const addGlistItem = (data, token) => {
  return client.post(`${itemGlistEndpoint}/${token}`, data);
};

export const deleteFridgeItem = (data, token) => {
  return client.delete(`${itemFridgeEndpoint}/${token}`, {}, data);
};

export const deleteGlistItem = (data, token) => {
  return client.delete(`${itemGlistEndpoint}/${token}`, {}, data);
};

export const editItem = (data, token) => {
  return client.put(`${endpoint}/${token}`, data);
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
