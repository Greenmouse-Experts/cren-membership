// @ts-nocheck
import axios from "axios";
import { getLocalToken } from "./helpers";
import { API_URL } from "./env";

const requestAutorization = () => {
  const token = getLocalToken("igbo_token");
  // console.log("custom token",token)
  return `Bearer ${token}`;
};
// console.log(requestAutorization());

export const Custom = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: requestAutorization(),
  },
});

export const CustomAdd = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: requestAutorization(),
  },
});

// Always send the latest login token (the original read it once at page load).
for (const client of [Custom, CustomAdd]) {
  client.interceptors.request.use((config) => {
    config.headers.Authorization = requestAutorization();
    return config;
  });
}
