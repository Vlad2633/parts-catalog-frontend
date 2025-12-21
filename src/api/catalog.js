import { http } from "./http.js";

export const CatalogApi = {
  getCategories: async () => (await http.get("/api/categories")).data,
  getBrands: async () => (await http.get("/api/brands")).data,

  getParts: async (params) => (await http.get("/api/parts", { params })).data,
  getPart: async (id) => (await http.get(`/api/parts/${id}`)).data,

  // admin
  createCategory: async (payload) => (await http.post("/api/categories", payload)).data,
  createBrand: async (payload) => (await http.post("/api/brands", payload)).data,
  createPart: async (payload) => (await http.post("/api/parts", payload)).data,
};
