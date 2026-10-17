import React from "react";
import { ArrowLeft } from "lucide-react";

export default function AuthBackLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primaryDark transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>{children}</span>
    </button>
  );
}
