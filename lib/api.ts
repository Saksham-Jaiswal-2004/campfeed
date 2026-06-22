import { auth } from "./firebase";

const BASE_URL = "http://localhost:3001/api";

export const api = async (endpoint: string, method = "GET", body: any) => {
  const user = auth.currentUser;

  const token = user ? await user.getIdToken() : null;

  const headers: Record<string, string> = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};