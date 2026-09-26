import React, { useState } from "react";
import { Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Button, TextField } from "../../components/ui";
import AuthFormShell from "./AuthFormShell";

function validate({ fullName, email, password, confirmPassword }) {
  if (!fullName.trim()) return "Vui lòng nhập họ tên.";
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Email không hợp lệ.";
  if (password.length < 6) return "Mật khẩu cần tối thiểu 6 ký tự.";
  if (password !== confirmPassword) return "Mật khẩu nhập lại không khớp.";
  return null;
}

export default function RegisterScreen({ onRegister, onGoLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate({ fullName, email, password, confirmPassword });
    if (v) { setError(v); return; }
    setBusy(true);
    setError("");
    const err = await onRegister({ fullName: fullName.trim(), email: email.trim().toLowerCase(), password });
    setBusy(false);
    if (err) setError(err);
  }

  return (
    <AuthFormShell topPadding={56}>
      <button type="button" onClick={onGoLogin} className="mb-4 -ml-1 p-1 self-start" aria-label="Quay lại">
        <ArrowLeft size={20} color={COLORS.fg} />
      </button>
      <span className="text-[22px] font-extrabold text-fg">Tạo tài khoản</span>
      <span className="text-[13.5px] text-descGray mt-[6px]">Bắt đầu hành trình ăn uống lành mạnh của bạn</span>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[14px] mt-6">
        <TextField label="Họ và tên" icon={UserIcon} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" />
        <TextField label="Email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@email.com" autoCapitalize="none" type="email" />
        <TextField label="Mật khẩu" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" secure />
        <TextField label="Nhập lại mật khẩu" icon={Lock} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" secure />
        {error ? <span className="text-destructive text-[13px] font-medium">{error}</span> : null}
        <Button onPress={handleSubmit} busy={busy} full>Đăng ký</Button>
      </form>

      <p className="text-center mt-6 text-[13.5px] text-descGray">
        Đã có tài khoản?{" "}
        <button type="button" className="text-primary font-bold" onClick={onGoLogin}>Đăng nhập</button>
      </p>
    </AuthFormShell>
  );
}
