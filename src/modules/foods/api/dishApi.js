import { request } from "../../../shared/api/httpClient";

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
