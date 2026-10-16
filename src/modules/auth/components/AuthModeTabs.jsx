import React from "react";

const TABS = [
  { mode: "login", label: "Đăng nhập" },
  { mode: "register", label: "Đăng ký" },
];

export default function AuthModeTabs({ mode, onSwitch }) {
  function handleClick(tabMode) {
    if (tabMode !== mode) onSwitch();
  }

  return (
    <div className="grid grid-cols-2 p-1 rounded-xl bg-muted border border-border">
      {TABS.map((tab) => {
        const activeStyle = tab.mode === mode ? "bg-white text-primary shadow-sm" : "text-fg/60 hover:text-fg";
        return (
          <button
            key={tab.mode}
            type="button"
            onClick={() => handleClick(tab.mode)}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${activeStyle}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
