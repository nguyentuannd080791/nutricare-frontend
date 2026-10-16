import { request } from "../../../shared/api/httpClient";

export const authApi = {
  register: (payload) => request("POST", "/auth/register", { body: payload }),
  login: (payload) => request("POST", "/auth/login", { body: payload }),
};
