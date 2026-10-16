import { request } from "../../../shared/api/httpClient";

export const bmiApi = {
  list: () => request("GET", "/bmi-records"),
  create: (payload) => request("POST", "/bmi-records", { body: payload }),
};
