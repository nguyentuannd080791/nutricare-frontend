const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 8;

const PASSWORD_RULES = [
  {
    id: "minLength",
    label: `Từ ${MIN_PASSWORD_LENGTH} ký tự`,
    message: `Mật khẩu cần tối thiểu ${MIN_PASSWORD_LENGTH} ký tự.`,
    test: (password) => password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: "lowercase",
    label: "Có chữ thường",
    message: "Mật khẩu cần có ít nhất 1 chữ cái thường.",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Có chữ số",
    message: "Mật khẩu cần có ít nhất 1 chữ số.",
    test: (password) => /\d/.test(password),
  },
];

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function normalizeFullName(fullName) {
  return fullName.trim();
}

export function validateFullName(fullName) {
  if (!normalizeFullName(fullName)) return "Vui lòng nhập họ tên.";
  return null;
}

export function validateEmail(email) {
  if (!EMAIL_PATTERN.test(email.trim())) return "Email không hợp lệ.";
  return null;
}

export function validatePassword(password) {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return rule.message;
  }
  return null;
}

export function evaluatePasswordRules(password) {
  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    passed: rule.test(password),
  }));
}

export function validatePasswordConfirm(confirmPassword, password) {
  if (confirmPassword !== password) return "Mật khẩu nhập lại không khớp.";
  return null;
}

export function validateLoginPassword(password) {
  if (!password) return "Vui lòng nhập mật khẩu.";
  return null;
}

export function validateTermsAccepted(accepted) {
  if (!accepted) return "Bạn cần đồng ý với Điều khoản dịch vụ & Chính sách bảo mật để tiếp tục.";
  return null;
}

export function validateLoginFields({ email, password }) {
  return {
    email: validateEmail(email),
    password: validateLoginPassword(password),
  };
}

export function validateRegisterFields({ fullName, email, password, confirmPassword, acceptedTerms }) {
  return {
    fullName: validateFullName(fullName),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validatePasswordConfirm(confirmPassword, password),
    terms: validateTermsAccepted(acceptedTerms),
  };
}

export function validateResetFields({ password, confirmPassword }) {
  return {
    password: validatePassword(password),
    confirmPassword: validatePasswordConfirm(confirmPassword, password),
  };
}

export function hasErrors(errors) {
  return Object.values(errors).some((message) => message !== null);
}
