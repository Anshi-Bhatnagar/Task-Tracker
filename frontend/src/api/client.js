const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

async function request(path, { method = "GET", body, auth = true, form = false } = {}) {
  const headers = {};
  if (!form) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: form ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.detail || "Something went wrong. Please try again.";
    throw new Error(typeof message === "string" ? message : "Request failed.");
  }

  return data;
}

export const api = {
  register: (email, username, password) =>
    request("/auth/register", { method: "POST", body: { email, username, password }, auth: false }),

  login: (email, password) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    return request("/auth/login", { method: "POST", body: form, auth: false, form: true });
  },

  me: () => request("/auth/me"),

  listProjects: () => request("/projects"),
  createProject: (name, description) =>
    request("/projects", { method: "POST", body: { name, description } }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  listTasks: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const query = params.toString();
    return request(`/tasks${query ? `?${query}` : ""}`);
  },
  createTask: (task) => request("/tasks", { method: "POST", body: task }),
  updateTask: (id, updates) => request(`/tasks/${id}`, { method: "PATCH", body: updates }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
