import React, { useState } from "react";
import { Mail, Lock, Salad } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { Button, TextField } from "../../components/ui";
import AuthFormShell from "./AuthFormShell";

/**
 * @param {(email:string, password:string) => Promise<string|null>} onLogin
 *   Trả về null nếu thành công, hoặc chuỗi lỗi để hiển thị.
 */
export default function LoginScreen({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setBusy(true);
    setError("");
    const err = await onLogin(email.trim().toLowerCase(), password);
    setBusy(false);
    if (err) setError(err);
  }

  return (
    <AuthFormShell>
      <div className="flex flex-col items-center mb-9">
        <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.primary }}>
          <Salad size={30} color="#fff" />
        </div>
        <span className="text-[22px] font-extrabold text-fg">NutriCare</span>
        <span className="text-[13px] text-descGray mt-1">Dinh dưỡng thông minh cho người Việt</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
        <TextField label="Email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@email.com" autoCapitalize="none" type="email" />
        <TextField label="Mật khẩu" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" secure />
        {error ? <span className="text-destructive text-[13px] font-medium">{error}</span> : null}
        <Button onPress={handleSubmit} busy={busy} full>Đăng nhập</Button>
      </form>

      <p className="text-center mt-8 text-[13.5px] text-descGray">
        Chưa có tài khoản?{" "}
        <button type="button" className="text-primary font-bold" onClick={onGoRegister}>Đăng ký ngay</button>
      </p>
    </AuthFormShell>
  );
}
