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

  async getShippingQueue() {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/shipments/queue`);
      return response.data;
    } catch (error) {
      console.error("getShippingQueue", error);
    }
  },

  async getShippingHistory() {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/shipments`);
      return response.data;
    } catch (error) {
      console.error("getShippingHistory", error);
    }
  },

  async searchShippingHistory(
    matchOrder,
    matchPart,
    resultsPerPage,
    pageNumber
  ) {
    try {
      const response = await axios.get(
        `${REACT_APP_API_URL}/shipments/search`,
        {
          params: {
            matchOrder,
            matchPart,
            resultsPerPage,
            pageNumber,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("searchShippingHistory", error);
    }
  },

  async createShipment(
    manifest,
    customer,
    deliveryMethod,
    trackingNumber = undefined,
    cost = undefined,
    carrier = undefined,
    deliverySpeed = undefined,
    customerAccount = undefined,
    customerHandoffName = undefined
  ) {
    console.log(customerHandoffName);
    const response = await axios.put(`${REACT_APP_API_URL}/shipments`, {
      manifest,
      customer,
      deliveryMethod,
      trackingNumber,
      cost,
      carrier,
      deliverySpeed,
      customerAccount,
      customerHandoffName,
    });

    return response.data;
  },
};
