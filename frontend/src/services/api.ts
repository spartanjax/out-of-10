const BASE_URL = 'http://192.168.86.30:8080/api/v1';

type AuthResponse = {
  token: string;
  user: { id: string; email: string };
};

async function authFetch(url: string, token: string, options?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Signup failed');
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Login failed');
  return data;
}

export async function postRating(
  token: string,
  params: { categoryId: string; score: number; ratedDate: string }
): Promise<void> {
  const res = await authFetch(`${BASE_URL}/ratings`, token, {
    method: 'POST',
    body: JSON.stringify({
      category_id: params.categoryId,
      score: params.score,
      rated_date: params.ratedDate,
    }),
  });
  if (!res.ok) throw new Error(`POST /ratings failed: ${res.status}`);
}

export async function getRatings(
  token: string,
  params: { categoryId: string; days: number }
): Promise<{ rated_date: string; score: number }[]> {
  const res = await authFetch(
    `${BASE_URL}/ratings?category_id=${params.categoryId}&days=${params.days}`,
    token
  );
  if (!res.ok) throw new Error(`GET /ratings failed: ${res.status}`);
  return res.json();
}
