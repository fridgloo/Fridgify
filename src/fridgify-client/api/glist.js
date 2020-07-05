import client from "./client";

const endpoint = "/glist";

const getGlists = (token) => client.get(`${endpoint}/${token}`);

const getGlistById = (glistId) => client.get(`${endpoint}/id/${glistId}`);

export const addGlist = (glistName, token) => {
  return client.post(`${endpoint}/${token}`, glistName);
};

export const deleteGlist = (glistId, token) => {
  const obj = { data: { _id: glistId } };
  return client.delete(`${endpoint}/${token}`, {}, obj);
};

export const editGlist = (newFridge, token) => {
  return client.put(`${endpoint}/${token}`, newFridge);
};

export const submitGlist = () => {
  return client.put();
};

export default {
  getGlists,
  getGlistById,
  addGlist,
  deleteGlist,
  editGlist,
};
