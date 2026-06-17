import { api } from "@/lib/axios";

export const getPurchaseOrders =
  async () => {
    const response =
      await api.get(
        "/purchase-orders"
      );

    return response.data;
  };

export const createPurchaseOrder =
  async (data: unknown) => {
    const response =
      await api.post(
        "/purchase-orders",
        data
      );

    return response.data;
  };

export const placePurchaseOrder =
  async (id: string) => {
    const response =
      await api.post(
        `/purchase-orders/${id}/place`
      );

    return response.data;
  };

export const cancelPurchaseOrder =
  async (id: string) => {
    const response =
      await api.post(
        `/purchase-orders/${id}/cancel`
      );

    return response.data;
  };

export const receivePurchaseOrder =
  async (id: string) => {
    const response =
      await api.post(
        `/purchase-orders/${id}/receive`
      );

    return response.data;
  };