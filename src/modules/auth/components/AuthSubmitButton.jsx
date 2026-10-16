import React from "react";
import { ArrowRight } from "lucide-react";

export default function AuthSubmitButton({ busy, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primaryDark disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
    >
      <span>{busy ? "Đang xử lý..." : children}</span>
      {busy ? null : <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
