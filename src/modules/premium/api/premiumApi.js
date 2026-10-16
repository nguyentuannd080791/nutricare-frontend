import { request } from "../../../shared/api/httpClient";

export const premiumApi = {
  upgrade: () => request("POST", "/premium/mock-upgrade"),
  cancel: () => request("POST", "/premium/mock-cancel"),
};
