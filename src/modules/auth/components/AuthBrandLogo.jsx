import React from "react";
import { Salad } from "lucide-react";

export default function AuthBrandLogo({ light = false }) {
  const iconStyle = light ? "bg-white/20 text-white backdrop-blur-sm" : "bg-primary text-white";
  const nameStyle = light ? "text-white" : "text-fg";
  const nameAccentStyle = light ? "text-bg" : "text-primary";
  const taglineStyle = light ? "text-white/80" : "text-primary";

  return (
    <div className="inline-flex items-center gap-2.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${iconStyle}`}>
        <Salad className="w-6 h-6" />
      </div>
      <div>
        <span className={`text-xl font-bold tracking-tight ${nameStyle}`}>
          Nutri<span className={nameAccentStyle}>Care</span>
        </span>
        <span className={`block text-[11px] font-medium ${taglineStyle}`}>
          Dinh dưỡng thông minh cho người Việt
        </span>
      </div>
    </div>
  );
}
