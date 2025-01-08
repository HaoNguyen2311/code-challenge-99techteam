import axios from "axios";

const API_URL = "https://interview.switcheo.com/prices.json";

export type CurrencyData = { currency: string; date: string; price: number };

export const getCurrencyData = async () => {
  const response = await axios.get<CurrencyData[]>(API_URL);
  return response.data;
};
