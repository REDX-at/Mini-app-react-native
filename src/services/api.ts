// src/services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

// Request interceptor: always read token from AsyncStorage before each request
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      // ensure header removed if no token
      delete (config.headers as any).Authorization;
    }
  } catch (e) {
    // ignore read errors
  }
  return config;
});

import { store } from "../store";
import { logoutThunk } from "../store/authSlice";

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       console.log("401 detected — logging out user");
//       await AsyncStorage.removeItem("accessToken");
//       store.dispatch(logoutThunk()); // redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        store.dispatch(logoutThunk());
        return Promise.reject(error);
      }

      try {
        // Request new access token
        const { data } = await axios.post(
          "https://dummyjson.com/auth/refresh",
          { refreshToken }
        );

        // Save the new access token
        await AsyncStorage.setItem("accessToken", data.accessToken);
        setAuthHeader(data.accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        store.dispatch(logoutThunk());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Synchronously set or clear the default Authorization header
export function setAuthHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
