import { useQuery } from "@tanstack/react-query";

import { getLowStockProducts } from "./stock.api";

export const useLowStockProducts = () => {
    return useQuery({
      queryKey: ["low-stock"],
      queryFn:
        getLowStockProducts,
    });
  };