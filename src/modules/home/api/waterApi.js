import { request } from "../../../shared/api/httpClient";

export const waterApi = {
  get: (date) => request("GET", `/water-logs?date=${date}`),
  set: (cups) => request("PUT", "/water-logs", { body: { cups } }),
};
