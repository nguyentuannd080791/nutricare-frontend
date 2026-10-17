import { request } from "../../../shared/api/httpClient";

export const workoutPlanApi = {
  get: (date) => request("GET", `/workout-plan?date=${date}`),
};
