import { http } from "./http";

export const OrdersApi = {
  create: async (payload) => (await http.post("/api/orders", payload)).data,
  list: async () => (await http.get("/api/orders")).data, // для адміна (якщо зробимо)
};
