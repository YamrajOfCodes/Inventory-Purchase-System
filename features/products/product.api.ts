import { api } from "@/lib/axios";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const createProduct = async (
  data: {
    name: string;
    sku: string;
    reorderLevel: number;
  }
) => {
  const response = await api.post(
    "/products",
    data
  );

  return response.data;
};