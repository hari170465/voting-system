export const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return res.json();
}

export const Auth = {
  signup: (email: string, password: string) =>
    api("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => api("/auth/logout", { method: "POST" }),
  me: () => api("/me"),
};

export const Candidates = {
  list: () => api("/candidates"),
  adminList: () => api("/candidates/admin"),
  create: (data: any) => api("/candidates/admin", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => api(`/candidates/admin/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  del: (id: string) => api(`/candidates/admin/${id}`, { method: "DELETE" }),
};

export const Vote = {
  cast: (candidateId: string) => api("/vote", { method: "POST", body: JSON.stringify({ candidateId }) }),
};

export const Results = { list: () => api("/results") };

export const Chat = {
  send: (message: string, history: {role:"user"|"assistant"; content:string}[] = []) =>
    api<{ reply: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),
};