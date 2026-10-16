import { request } from "../../../shared/api/httpClient";

// Đồng bộ "đã ăn" lên server. Server tự đối chiếu với thực đơn (món/calo lấy
// từ thực đơn, không từ client) nên client chỉ gửi bữa nào, ngày nào, đã ăn hay chưa.
export const mealLogApi = {
  list: () => request("GET", "/meal-logs"),
  set: (payload) => request("PUT", "/meal-logs", { body: payload }),
};
