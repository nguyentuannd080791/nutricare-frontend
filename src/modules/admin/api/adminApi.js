import { request } from "../../../shared/api/httpClient";

export const adminApi = {
  stats: (days) => request("GET", `/admin/stats?days=${days}`),
  users: ({ page = 1, pageSize = 20, search, premium } = {}) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) params.set("search", search);
    if (premium !== undefined && premium !== null && premium !== "") {
      params.set("premium", String(premium));
    }
    return request("GET", `/admin/users?${params}`);
  },
  user: (id) => request("GET", `/admin/users/${id}`),
};
