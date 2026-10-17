import { request } from "../../../shared/api/httpClient";

export const streakApi = {
  get: () => request("GET", "/streak"),
};
