import { request } from "./httpClient";
import { AI_TIMEOUT_MS } from "./apiConfig";

// Toàn bộ "hợp đồng" giữa app và backend nằm ở đây — màn hình không tự ghép URL.
// Backend là nơi quyết định mọi nghiệp vụ (công thức, luật lọc món, giới hạn
// gói); client chỉ gửi dữ liệu thô và hiển thị kết quả.

export const authApi = {
  register: (payload) => request("POST", "/auth/register", { body: payload }),
  login: (payload) => request("POST", "/auth/login", { body: payload }),
};

export const meApi = {
  get: () => request("GET", "/me"),
  update: (payload) => request("PATCH", "/me", { body: payload }),
};

export const bmiApi = {
  list: () => request("GET", "/bmi-records"),
  create: (payload) => request("POST", "/bmi-records", { body: payload }),
};

export const targetApi = {
  list: () => request("GET", "/nutrition-targets"),
  preview: (payload) => request("POST", "/nutrition-targets/preview", { body: payload }),
  create: (payload) => request("POST", "/nutrition-targets", { body: payload }),
};

export const conditionApi = {
  list: () => request("GET", "/health-conditions"),
  create: (payload) => request("POST", "/health-conditions", { body: payload }),
  update: (id, payload) => request("PUT", `/health-conditions/${id}`, { body: payload }),
  remove: (id) => request("DELETE", `/health-conditions/${id}`),
};

export const planApi = {
  history: () => request("GET", "/plan/history"),
  generate: (days) => request("POST", "/plan/generate", { body: { days } }),
  swap: (payload) => request("POST", "/plan/swap", { body: payload }),
  diversify: (planId) => request("POST", "/plan/diversify", { body: { planId }, timeoutMs: AI_TIMEOUT_MS }),
  applyDiversification: (planId, selections) => request("POST", "/plan/diversify/apply", { body: { planId, selections } }),
};

export const dishApi = {
  groups: () => request("GET", "/dishes/groups"),
  search: ({ query, groupId, page }) => {
    const params = new URLSearchParams({ page: String(page) });
    if (query) params.set("query", query);
    if (groupId) params.set("groupId", String(groupId));
    return request("GET", `/dishes?${params}`);
  },
  get: (id) => request("GET", `/dishes/${id}`),
};

export const rawFoodApi = {
  groups: () => request("GET", "/raw-foods/groups"),
  search: ({ query, groupId, page }) => {
    const params = new URLSearchParams({ page: String(page) });
    if (query) params.set("query", query);
    if (groupId) params.set("groupId", String(groupId));
    return request("GET", `/raw-foods?${params}`);
  },
  get: (id) => request("GET", `/raw-foods/${id}`),
};

export const scanApi = {
  analyze: (imageBase64, mealSlot) => request("POST", "/scan/analyze", { body: { imageBase64, mealSlot }, timeoutMs: AI_TIMEOUT_MS }),
};

export const premiumApi = {
  upgrade: () => request("POST", "/premium/mock-upgrade"),
  cancel: () => request("POST", "/premium/mock-cancel"),
};
