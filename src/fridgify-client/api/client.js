import { create } from "apisauce";
import authStorage from "../auth/storage";
import cache from "../util/cache";

const apiClient = create({
  baseURL: "http://10.0.0.77:3200/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();
  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
