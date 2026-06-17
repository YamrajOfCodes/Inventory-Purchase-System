import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  placePurchaseOrder,
  cancelPurchaseOrder,
  receivePurchaseOrder,
} from "./purchase-orderAPI";

export const usePurchaseOrders =
  () => {
    return useQuery({
      queryKey: [
        "purchase-orders",
      ],

      queryFn:
        getPurchaseOrders,
    });
  };

export const useCreatePurchaseOrder =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        createPurchaseOrder,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "purchase-orders",
            ],
          }
        );
      },
    });
  };

export const usePlacePurchaseOrder =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        placePurchaseOrder,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "purchase-orders",
            ],
          }
        );
      },
    });
  };

export const useCancelPurchaseOrder =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        cancelPurchaseOrder,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "purchase-orders",
            ],
          }
        );
      },
    });
  };

export const useReceivePurchaseOrder =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn:
        receivePurchaseOrder,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "purchase-orders",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "products",
            ],
          }
        );

        queryClient.invalidateQueries(
          {
            queryKey: [
              "low-stock",
            ],
          }
        );
      },
    });
  };