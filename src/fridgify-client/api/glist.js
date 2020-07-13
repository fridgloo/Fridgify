import client from "./client";

const endpoint = "/glist";

const getGlists = () => {
  return client.get(endpoint);
};

const getGlistById = (glistId) => client.get(`${endpoint}/id/${glistId}`);

export const addGlist = (glistName) => {
  return client.post(endpoint, glistName);
};

export const deleteGlist = (glistId) => {
  const obj = { data: glistId };
  return client.delete(endpoint, {}, obj);
};

export const editGlist = (newGlist) => {
  return client.put(endpoint, newGlist);
};

export const submitGlist = (data) => {
  return client.put(`${endpoint}/fridge`, data);
};

export default {
  getGlists,
  getGlistById,
  addGlist,
  deleteGlist,
  editGlist,
  submitGlist,
};
