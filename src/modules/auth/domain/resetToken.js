const TOKEN_PARAM = "reset_token";

export function parseResetTokenFromHash(hash) {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get(TOKEN_PARAM);
  return token ? token.trim() : null;
}
