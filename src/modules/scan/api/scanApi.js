import { request } from "../../../shared/api/httpClient";
import { AI_TIMEOUT_MS } from "../../../shared/api/apiConfig";

export const scanApi = {
  analyze: (imageBase64, mealSlot) =>
    request("POST", "/scan/analyze", {
      body: { imageBase64, mealSlot },
      timeoutMs: AI_TIMEOUT_MS,
    }),
};
