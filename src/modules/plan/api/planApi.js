import { request } from "../../../shared/api/httpClient";
import { AI_TIMEOUT_MS } from "../../../shared/api/apiConfig";

export const planApi = {
  history: () => request("GET", "/plan/history"),
  generate: (days) => request("POST", "/plan/generate", { body: { days } }),
  swap: (payload) => request("POST", "/plan/swap", { body: payload }),
  diversify: (planId) =>
    request("POST", "/plan/diversify", {
      body: { planId },
      timeoutMs: AI_TIMEOUT_MS,
    }),
  applyDiversification: (planId, selections) =>
    request("POST", "/plan/diversify/apply", { body: { planId, selections } }),
};
