import { request } from "../../../shared/api/httpClient";

export const exerciseApi = {
  catalog: () => request("GET", "/exercises"),
  list: (date) => request("GET", `/exercise-logs?date=${date}`),
  add: (payload) => request("POST", "/exercise-logs", { body: payload }),
  remove: (id, date = null) =>
    request("DELETE", `/exercise-logs/${id}${date ? `?date=${date}` : ""}`),
};
