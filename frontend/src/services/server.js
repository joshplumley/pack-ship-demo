import axios from "axios";

let { REACT_APP_API_URL } = process.env;

export const API = {
  async getPackingQueue() {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/workOrders/packingQueue`
      );
      return response.data;
    } catch (error) {
      console.error("getPackingQueue", error);
    }
  },

  async getAllWorkOrders() {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/workOrders`);
      return response.data;
    } catch (error) {
      console.error("getAllWorkOrders", error);
    }
  },

  async createPackingSlip(items, customer, orderNumber) {
    const response = await axios.put(`${REACT_APP_API_URL}/packingSlips`, {
      items,
      customer,
      orderNumber,
    });

    return response.data;
  },
};
