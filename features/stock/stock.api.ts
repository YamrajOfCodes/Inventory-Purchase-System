import { api } from "@/lib/axios";

export const getLowStockProducts = async () => {
    const res = await api.get(
      "/stock/low"
    );

    return res.data;
  };