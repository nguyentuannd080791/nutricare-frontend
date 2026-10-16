import { request } from "../../../shared/api/httpClient";

export const targetApi = {
  list: () => request("GET", "/nutrition-targets"),
  preview: (payload) =>
    request("POST", "/nutrition-targets/preview", { body: payload }),
  create: (payload) => request("POST", "/nutrition-targets", { body: payload }),
};
