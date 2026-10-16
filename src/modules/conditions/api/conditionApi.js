import { request } from "../../../shared/api/httpClient";

export const conditionApi = {
  list: () => request("GET", "/health-conditions"),
  create: (payload) => request("POST", "/health-conditions", { body: payload }),
  update: (id, payload) =>
    request("PUT", `/health-conditions/${id}`, { body: payload }),
  remove: (id) => request("DELETE", `/health-conditions/${id}`),
};
