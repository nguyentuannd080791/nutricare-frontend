/**
 * Bảng màu copy nguyên văn từ nutricare-expo/src/theme/colors.js để giữ
 * đúng thương hiệu khi chuyển RN -> React DOM + Tailwind. Không tự ý đổi giá trị
 * ở đây — nếu cần đổi màu, sửa src/theme/colors.js (nguồn sự thật duy nhất)
 * rồi đồng bộ lại file này.
 */
import { COLORS } from "./src/theme/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: COLORS.primary,
        primaryDark: COLORS.primaryDark,
        secondary: COLORS.secondary,
        accent: COLORS.accent,
        bg: COLORS.bg,
        fg: COLORS.fg,
        muted: COLORS.muted,
        border: COLORS.border,
        destructive: COLORS.destructive,
        card: COLORS.card,
        // Các màu phụ dùng rải rác trong ui.js gốc (placeholder, mô tả, tông cảnh báo)
        placeholderGray: "#94A3B8",
        descGray: "#64748B",
        dangerBg: "#FEF2F2",
        warnBg: "#FFF7ED",
        warnFg: "#C2410C",
        dark: "#0F172A",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        app: "480px", // khung điện thoại mô phỏng khi xem trên màn hình rộng
      },
    },
  },
  plugins: [],
};
