import { request } from "../../../shared/api/httpClient";

export const authApi = {
  register: (payload) => request("POST", "/auth/register", { body: payload }),
  login: (payload) => request("POST", "/auth/login", { body: payload }),
  forgotPassword: (email) => request("POST", "/auth/forgot-password", { body: { email } }),
  resetPassword: (token, password) => request("POST", "/auth/reset-password", { body: { token, password } }),
};
