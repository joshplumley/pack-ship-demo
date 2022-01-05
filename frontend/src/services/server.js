import axios from "axios";

let { API_URL } = process.env;

export const API = {
    async getPackingQueue() {
        try {
            const response = await axios.get(`http://localhost:3000/workOrders/packingQueue`,);
            return response.data;
        } catch (error) {
            console.error("getPackingQueue", error);
        }
    },
}