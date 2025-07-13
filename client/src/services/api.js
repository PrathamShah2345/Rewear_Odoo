// src/api.js

const BASE = import.meta.env.VITE_API || 'http://localhost:5000';
console.log(import.meta.env.VITE_API, BASE)
// 🔐 Auth
export const register = async (username, email, password) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getCurrentUser = async (token) => {
  const res = await fetch(`${BASE}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch current user');
  }
  
  return res.json();
};



// 🧺 Items
export const uploadItem = async (item, token) => {
  const res = await fetch(`${BASE}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const getItems = async (tags = '') => {
  const url = tags ? `${BASE}/items?tags=${tags}` : `${BASE}/items`;
  const res = await fetch(url);
  return res.json();
};

export const getItemsByUsername = async (username) => {
  const res = await fetch(`${BASE}/users/${username}/items`);
  return res.json();
};



// 🔁 Swaps
export const requestSwap = async (itemId, token) => {
  const res = await fetch(`${BASE}/swaps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item_id: itemId }),
  });
  return res.json();
};

export const respondToSwap = async (swapId, status, token) => {
  const res = await fetch(`${BASE}/swaps/${swapId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const getMySwaps = async (token, status = '') => {
  const url = status ? `${BASE}/swaps/mine?status=${status}` : `${BASE}/swaps/mine`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const cancelSwap = async (swapId, token) => {
  const res = await fetch(`${BASE}/swaps/${swapId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};



// 👤 Users
export const getUserProfile = async (username) => {
  const res = await fetch(`${BASE}/users/${username}`);
  return res.json();
};

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE}/users/leaderboard`);
  return res.json();
};
