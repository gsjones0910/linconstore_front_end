import axios from "axios";
import { baseUrl } from "../Helpers/baseUrl";
import Cookies from "js-cookie";

interface ApiCall {
  method?: string;
  route: string;
  body?: any;
  secure?: boolean;

  [key: string]: any;
}

export const client = axios.create({
  baseURL: `${baseUrl}/api/v2`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCall = function ({
  method = "GET",
  route,
  body = {},
  secured = true,
  ...args
}: ApiCall) {
  // const token = localStorage.getItem("token");
  const token = Cookies.get("token");

  if (token && secured) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  client.interceptors.request.use((config) => {
    return config;
  });

  const onSuccess = function (response) {
    return response.data;
  };

  const onError = function (error) {
    console.log("Request failed", error);
  };

  return client({
    method,
    url: route,
    data: body,
    ...args,
  })
    .then(onSuccess)
    .catch(onError);
};
