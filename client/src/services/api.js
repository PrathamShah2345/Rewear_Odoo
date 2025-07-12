const BASE = "http://localhost:5000/";

export const login = async (email, password) => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
