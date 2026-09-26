import React, { useEffect, useRef, useState } from "react";
import { Camera as CameraIcon, RotateCcw, ArrowLeft } from "lucide-react";
import { COLORS } from "../../theme/colors";
import { scanApi } from "../../services/api";
import { useCamera } from "../../hooks/useCamera";

/**
 * Bước "Quét món ăn": xin quyền Camera (getUserMedia) -> chụp -> gửi ảnh
 * (base64) cho backend nhận diện -> chuyển kết quả cho ScanResultScreen.
 * Đây là phần native-gap DUY NHẤT được làm ở phase này (theo yêu cầu); nút
 * back vật lý và bộ chọn giờ nằm trong TODO.md.
 */
export default function ScanScreen({ mealSlot, onAnalyzed, onCancel }) {
  const { videoRef, status, error, start, toggleFacing, capturePhoto } = useCamera();
  const [busy, setBusy] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "idle" || status === "requesting") {
    return (
      <div style={styles.center}>
        <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "denied" || status === "unsupported") {
    return (
      <div style={styles.center}>
        <p style={styles.permText}>{error || "NutriCare cần quyền truy cập Camera để quét món ăn."}</p>
        {status === "denied" && (
          <button type="button" style={styles.primaryBtn} onClick={() => start()}>
            <span style={styles.primaryBtnText}>Cấp quyền Camera</span>
          </button>
        )}
        <button type="button" onClick={onCancel} className="text-descGray text-[13px] font-semibold mt-2">Quay lại</button>
      </div>
    );
  }

  async function handleCapture() {
    if (busy) return;
    const photo = capturePhoto(0.7);
    if (!photo) return;
    setBusy(true);
    setCaptureError("");
    try {
      const scanId = `scan_${Date.now()}`;
      const result = await scanApi.analyze(photo.base64, mealSlot);
      onAnalyzed({ scanId, photoUri: photo.dataUrl, result });
    } catch (err) {
      setCaptureError(err.message || "Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-10 left-4 right-4 flex flex-row items-center gap-3 z-10">
          <button type="button" onClick={onCancel} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <ArrowLeft color="#fff" size={24} />
          </button>
          <span className="text-[18px] font-bold text-white">Quét món ăn</span>
        </div>
        <div className="relative z-10 aspect-square w-[80%] rounded-[24px]" style={{ border: "2px dashed rgba(255,255,255,0.8)" }} />
        {captureError ? (
          <p className="absolute bottom-6 left-8 right-8 text-center text-white text-[13px] z-10">{captureError}</p>
        ) : (
          <p className="absolute bottom-6 left-8 right-8 text-center text-white text-[13px] z-10">Hướng camera vào món ăn rồi bấm quét</p>
        )}
      </div>

      <div className="flex flex-row items-center justify-between px-8 py-6 bg-black">
        <button type="button" onClick={onCancel} disabled={busy} className="w-12 h-12 flex items-center justify-center">
          <span className="text-white text-[13px]">Huỷ</span>
        </button>

        <button
          type="button"
          onClick={handleCapture}
          disabled={busy}
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
          style={{ backgroundColor: COLORS.primary, opacity: busy ? 0.7 : 1 }}
        >
          {busy ? <span className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <CameraIcon color="#fff" size={28} />}
        </button>

        <button type="button" onClick={toggleFacing} disabled={busy} className="w-12 h-12 flex items-center justify-center">
          <RotateCcw color="#fff" size={20} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  center: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 16, backgroundColor: COLORS.bg },
  permText: { textAlign: "center", color: COLORS.fg, fontSize: 14 },
  primaryBtn: { backgroundColor: COLORS.primary, paddingLeft: 20, paddingRight: 20, paddingTop: 12, paddingBottom: 12, borderRadius: 12 },
  primaryBtnText: { color: "#fff", fontWeight: 600 },
};
