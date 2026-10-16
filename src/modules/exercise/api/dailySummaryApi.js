import { request } from "../../../shared/api/httpClient";

export const dailySummaryApi = {
  get: (date) => request("GET", `/daily-summary?date=${date}`),
};
