import { auth } from "./firebase";

const BASE_URL = "http://localhost:3001/api";

export const api = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
) => {
  const user = auth.currentUser;

  const token = user ? await user.getIdToken() : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
};