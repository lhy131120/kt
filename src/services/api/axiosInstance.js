import axios from "axios";
import { API_BASE, API_PATH, getTokenFromCookie } from "./config";

let loadingController = {
  show: () => { },
  hide: () => { },
  forceHide: () => { },
}

// 提供一個方法讓外部設定 loadingController
export const setLoadingController = (controller) => {
  loadingController = controller;
}

// 追蹤正在進行的請求，避免重複顯示 loading
const pendingRequests = new Set();

// API 實例，會自動帶上 Token 和處理 loading 狀態
export const api = axios.create({
  baseURL: `${API_BASE}/api/${API_PATH}`,
  timeout: 10000,
});

export const plainApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Request 攔截器，加入 Token
const requestInterceptor = (config) => {
  const token = getTokenFromCookie();
  token && (config.headers.Authorization = `${token}`);

  if (!config.silent) {

    // 這裡可以加入全局 loading 狀態的處理，例如：
    const requestId = `${config.method}-${config.url}-${Date.now()}`;
    config._requestId = requestId;
    pendingRequests.add(requestId);

    // 如果是第一個請求，顯示 loading
    if (pendingRequests.size === 1) {
      loadingController.show();
    }
  }

  return config;
}

const responseSuccessHandler = (response) => {
  const { config } = response;
  if (config._requestId) {
    pendingRequests.delete(config._requestId);

    // 所有請求完成時隱藏 loading
    if (pendingRequests.size === 0) {
      loadingController.hide();
    }
  }
  return response;
}

const responseErrorHandler = (error) => {
  const { config, response } = error;

  if (config?._requestId) {
    pendingRequests.delete(config._requestId);

    if (pendingRequests.size === 0) {
      loadingController.forceHide();
    }
  }

  if (response?.status === 401) {
    document.cookie = "ktToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = `${import.meta.env.BASE_URL}#/login`;
  }

  return Promise.reject(error);
}

// bind interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(responseSuccessHandler, responseErrorHandler);

plainApi.interceptors.request.use(requestInterceptor);
plainApi.interceptors.response.use(responseSuccessHandler, responseErrorHandler);
