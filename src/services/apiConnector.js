import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  const token = localStorage.getItem("token");

  const finalHeaders = {
    ...headers,
  };

  // ✅ Attach token automatically
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  // ✅ REMOVE Content-Type if FormData
  if (bodyData instanceof FormData) {
    delete finalHeaders["Content-Type"];
  }

  return axiosInstance({
    method,
    url,
    data: bodyData,
    params,
    headers: finalHeaders,
  });
};