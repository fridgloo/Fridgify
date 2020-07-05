import client from "./client";

const register = (userInfo) => client.post("/user", userInfo);

export default { register };
