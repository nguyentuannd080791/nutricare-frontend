// Bản port từ nutricare-expo/src/storage/appStorage.js.
// Giữ nguyên interface (tên hàm, tham số, Promise trả về) để các màn hình gọi
// giống hệt bản RN — chỉ đổi hạ tầng lưu trữ AsyncStorage -> localStorage.
// Chỉ giữ những gì THUỘC VỀ THIẾT BỊ: phiên đăng nhập (JWT) và dữ liệu cục bộ
// của từng tài khoản (tick "đã ăn" theo ngày, cài đặt nhắc nhở). Mọi dữ liệu
// còn lại (hồ sơ, BMI, mục tiêu, bệnh nền, thực đơn) nằm ở backend.

const TOKEN_KEY = "nutricare:token";
const localKey = (userId) => `nutricare:local:${userId}`;

// localStorage là đồng bộ, nhưng giữ hàm dạng async để khớp interface gốc
// (AsyncStorage) và không phải sửa lại code gọi ở App.js/màn hình.
function getItem(key) {
  try {
    return Promise.resolve(window.localStorage.getItem(key));
  } catch {
    return Promise.resolve(null);
  }
}

function setItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    console.error("[NutriCare] Lưu dữ liệu thất bại:", e);
  }
  return Promise.resolve();
}

function removeItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // bỏ qua — không có gì để xoá
  }
  return Promise.resolve();
}

async function getJSON(key, fallback) {
  try {
    const raw = await getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const loadToken = () => getItem(TOKEN_KEY);
export const saveToken = (token) => (token ? setItem(TOKEN_KEY, token) : removeItem(TOKEN_KEY));

const DEFAULT_REMINDERS = {
  sang: { enabled: false, time: "07:00" },
  trua: { enabled: false, time: "12:00" },
  toi: { enabled: false, time: "19:00" },
  nuoc: { enabled: false, intervalHours: 2 },
};

export async function loadLocalData(userId) {
  return { progress: {}, reminders: DEFAULT_REMINDERS, ...(await getJSON(localKey(userId), {})) };
}

export async function saveLocalData(userId, data) {
  await setItem(localKey(userId), JSON.stringify(data));
}
