import React from "react";
import AuthBrandLogo from "./AuthBrandLogo";
import AuthBrandShowcase from "./AuthBrandShowcase";
import AuthModeTabs from "./AuthModeTabs";

export default function AuthFormShell({ mode, onSwitchMode, children }) {
  return (
    <main className="flex-1 min-h-0 w-full bg-white text-fg grid grid-cols-1 lg:grid-cols-12 grid-rows-[minmax(0,1fr)]">
      <AuthBrandShowcase mode={mode} />

      <section className="lg:col-span-7 xl:col-span-6 flex flex-col px-6 py-8 sm:px-12 sm:py-10 lg:px-16 bg-white overflow-y-auto min-h-0">
        <div className="lg:hidden pb-4 border-b border-border">
          <AuthBrandLogo />
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-6 space-y-6">
          <AuthModeTabs mode={mode} onSwitch={onSwitchMode} />
          {children}
        </div>
      </section>
    </main>
  );
}
