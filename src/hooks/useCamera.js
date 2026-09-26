import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Trách nhiệm duy nhất: vòng đời camera trình duyệt (getUserMedia) — tương
 * đương phần "xin quyền + mở camera" của expo-camera. Không biết gì về màn
 * hình Scan hay việc gọi API nhận diện món ăn.
 *
 * status: "idle" (chưa xin quyền) | "requesting" | "granted" | "denied" | "unsupported"
 */
export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [facing, setFacing] = useState("environment"); // environment=camera sau, user=camera trước
  const [error, setError] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(
    async (facingMode = facing) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        setError("Trình duyệt này không hỗ trợ truy cập camera.");
        return;
      }
      setStatus("requesting");
      setError("");
      stopStream();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("granted");
      } catch (e) {
        setStatus("denied");
        setError(
          e.name === "NotAllowedError"
            ? "Bạn đã từ chối quyền Camera. Hãy cấp quyền trong cài đặt trình duyệt rồi thử lại."
            : "Không thể mở camera trên thiết bị này."
        );
      }
    },
    [facing, stopStream]
  );

  const toggleFacing = useCallback(() => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    start(next);
  }, [facing, start]);

  useEffect(() => stopStream, [stopStream]);

  /** Chụp khung hình hiện tại của <video> thành JPEG (dataURL + base64 thuần). */
  const capturePhoto = useCallback((quality = 0.7) => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    return { dataUrl, base64: dataUrl.split(",")[1] };
  }, []);

  return { videoRef, status, error, facing, start, toggleFacing, capturePhoto, stop: stopStream };
}
