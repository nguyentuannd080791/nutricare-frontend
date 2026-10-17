import { parseResetTokenFromHash } from "../domain/resetToken";

let pendingToken = null;

export function capturePendingResetToken() {
  const token = parseResetTokenFromHash(window.location.hash);
  if (!token) return;
  pendingToken = token;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

export function getPendingResetToken() {
  return pendingToken;
}

export function clearPendingResetToken() {
  pendingToken = null;
}
