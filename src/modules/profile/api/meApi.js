import { request } from "../../../shared/api/httpClient";

export const meApi = {
  get: () => request("GET", "/me"),
  update: (payload) => request("PATCH", "/me", { body: payload }),
};
