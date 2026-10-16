import { request } from "../../../shared/api/httpClient";

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
