import { request } from "../../../shared/api/httpClient";

export const paymentApi = {
  createOrder: (plan) => request("POST", "/payment/create-order", { body: { plan } }),
  getOrderStatus: (orderCode) => request("GET", `/payment/orders/${orderCode}`),
  simulateSuccess: (orderCode) => request("POST", `/payment/orders/${orderCode}/simulate`),
  getMyHistory: () => request("GET", "/payment/my-history"),
  getAdminPaymentReport: (days = 30) => request("GET", `/admin/payments/payment-report?days=${days}`),
};

