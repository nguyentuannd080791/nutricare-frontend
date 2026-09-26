import { useCallback, useEffect, useState } from "react";
import { authApi, meApi } from "../services/api";
import { setAuthToken, setUnauthorizedHandler } from "../services/httpClient";
import { loadToken, saveToken } from "../storage/appStorage";

/**
 * Trách nhiệm duy nhất: phiên đăng nhập — ai đang đăng nhập, khôi phục token
 * lúc khởi động, đăng nhập/đăng ký/đăng xuất. Không đụng tới dữ liệu nghiệp vụ
 * (BMI, mục tiêu, thực đơn...) — đó là việc của useServerData/useLocalData.
 *
 * @param {{ onSessionStart:(user:object)=>Promise<void>, onSessionEnd:()=>void, onSessionExpired:(msg:string)=>void }} callbacks
 */
export function useAuth({ onSessionStart, onSessionEnd, onSessionExpired }) {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    setAuthToken(null);
    saveToken(null);
    setUser(null);
    onSessionEnd();
  }, [onSessionEnd]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      onSessionExpired("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
    });
  }, [logout, onSessionExpired]);

  useEffect(() => {
    (async () => {
      try {
        const token = await loadToken();
        if (token) {
          setAuthToken(token);
          const me = await meApi.get();
          setUser(me);
          await onSessionStart(me);
        }
      } catch (e) {
        setAuthToken(null);
        if (e.status === 0) onSessionExpired(e.message);
      } finally {
        setBooting(false);
      }
    })();
    // Chỉ chạy 1 lần lúc khởi động — cố ý bỏ qua deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAuth(request) {
    setAuthToken(null); // tránh 401 cũ bị hiểu nhầm là hết phiên
    try {
      const { token, user: authedUser } = await request();
      setAuthToken(token);
      await saveToken(token);
      setUser(authedUser);
      await onSessionStart(authedUser);
      return null;
    } catch (e) {
      setAuthToken(null);
      return e.message;
    }
  }

  const login = (email, password) => handleAuth(() => authApi.login({ email, password }));
  const register = (payload) => handleAuth(() => authApi.register(payload));
  const refreshUser = useCallback(() => meApi.get().then(setUser).catch(() => {}), []);
  const updateProfile = useCallback(async (payload) => setUser(await meApi.update(payload)), []);

  return { booting, user, setUser, login, register, logout, refreshUser, updateProfile };
}
