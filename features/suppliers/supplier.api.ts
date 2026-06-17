import { api } from "@/lib/axios";

export const getSuppliers = async () => {
  const res = await api.get("/suppliers");
  return res.data;
};

export const createSupplier = async (data: {
  name: string;
}) => {
  const res = await api.post("/suppliers", data);
  return res.data;
};