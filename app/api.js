// AniFind API helper for React Native + Expo
const BASE_URL = 'http://127.0.0.1:8000';

export async function registerUser(username, email, password) {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getProfile(username, token) {
  const res = await fetch(`${BASE_URL}/users/profile/${username}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function updateProfile(username, email, password, token) {
  const res = await fetch(`${BASE_URL}/users/profile/${username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function listAnime() {
  const res = await fetch(`${BASE_URL}/anime/`);
  return res.json();
}

export async function searchAnime(title) {
  const res = await fetch(`${BASE_URL}/anime/search?title=${encodeURIComponent(title)}`);
  return res.json();
}

export async function recommendAnime() {
  const res = await fetch(`${BASE_URL}/anime/recommend`);
  return res.json();
}

export async function matchUsers(interest) {
  const res = await fetch(`${BASE_URL}/matchmaking/match?interest=${encodeURIComponent(interest)}`);
  return res.json();
}

// Admin endpoints
export async function listUsers(token) {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function deleteUser(username, token) {
  const res = await fetch(`${BASE_URL}/admin/user/${username}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function listAnimes(token) {
  const res = await fetch(`${BASE_URL}/admin/animes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function deleteAnime(animeId, token) {
  const res = await fetch(`${BASE_URL}/admin/anime/${animeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
