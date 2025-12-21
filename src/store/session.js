import { setAuthToken } from "../api/http";

const KEY = "parts_token";

export function loadToken() {
  return localStorage.getItem(KEY);
}

export function saveToken(token) {
  localStorage.setItem(KEY, token);
  setAuthToken(token);
}

export function clearToken() {
  localStorage.removeItem(KEY);
  setAuthToken(null);
}
