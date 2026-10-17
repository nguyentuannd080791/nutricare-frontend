import React from "react";
import { Moon } from "lucide-react";

export default function RestDayNotice({ title, children }) {
  return (
    <section className="rounded-3xl bg-white border border-border p-5 sm:p-7 shadow-sm flex items-start gap-3">
      <div className="p-2.5 rounded-xl bg-bg text-primary shrink-0">
        <Moon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-fg">{title}</h2>
        <p className="text-xs text-fg/60 leading-relaxed">{children}</p>
      </div>
    </section>
  );
}
