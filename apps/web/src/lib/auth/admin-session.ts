export type AdminSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminLoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  user: AdminSessionUser;
};

const ADMIN_TOKEN_KEY = 'hari_portfolio_admin_token';
const ADMIN_USER_KEY = 'hari_portfolio_admin_user';

export function storeAdminSession(response: AdminLoginResponse) {
  localStorage.setItem(ADMIN_TOKEN_KEY, response.accessToken);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.user));
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser(): AdminSessionUser | null {
  const value = localStorage.getItem(ADMIN_USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AdminSessionUser;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}
