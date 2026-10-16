import React from "react";

const GOOGLE_ICON = (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z" />
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z" />
    <path fill="#FBBC05" d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 20.9 7.4 24 12 24z" />
  </svg>
);

const FACEBOOK_ICON = (
  <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);

const PROVIDERS = [
  { id: "google", name: "Google", icon: GOOGLE_ICON },
  { id: "facebook", name: "Facebook", icon: FACEBOOK_ICON },
];

export default function AuthSocialSection({ label }) {
  return (
    <div className="space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="border-t border-border w-full" />
        <span className="bg-white px-3 text-xs font-medium text-fg/50 whitespace-nowrap">{label}</span>
        <div className="border-t border-border w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border bg-white hover:bg-muted text-fg text-sm font-medium transition-all active:scale-[0.99]"
          >
            {provider.icon}
            <span>{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
