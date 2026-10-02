export const API_URL = 'https://geolocate-backend-production.up.railway.app';

const TOKEN_KEY = 'geolocate_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Заголовок для защищённых запросов (в том числе для загрузки фото)
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

async function authRequest(path, email, password) {
  const data = await request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export const register = (email, password) => authRequest('/register', email, password);
export const login = (email, password) => authRequest('/login', email, password);

// Возвращает пользователя по сохранённому токену или null
export async function fetchMe() {
  if (!getToken()) return null;
  try {
    const data = await request('/me', { headers: authHeader() });
    return data.user;
  } catch {
    clearToken();
    return null;
  }
}
