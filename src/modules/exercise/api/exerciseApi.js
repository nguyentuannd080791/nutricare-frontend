import { request } from "../../../shared/api/httpClient";

export const exerciseApi = {
  catalog: () => request("GET", "/exercises"),
  list: (date) => request("GET", `/exercise-logs?date=${date}`),
  add: (payload) => request("POST", "/exercise-logs", { body: payload }),
  remove: (id) => request("DELETE", `/exercise-logs/${id}`),
};
