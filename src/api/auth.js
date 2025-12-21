import { http } from "./http.js";

export const AuthApi = {
  register: async (payload) => (await http.post("/api/auth/register", payload)).data,
  login: async (payload) => (await http.post("/api/auth/login", payload)).data,
  me: async () => (await http.get("/api/auth/me")).data,
};
