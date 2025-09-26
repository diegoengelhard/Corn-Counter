const WINDOW_MS = 60_000;

// Last allowed request timestamp by clientId
const lastAllowedAt = new Map<string, number>();

// Counter for purchases by clientId
const purchasesByClient = new Map<string, number>();

// Global corn sold counter 
let totalSold = 0;

export type WindowCheck =
  | { allowed: true; retryAfterSeconds: 0; nextAllowedAt: number }
  | { allowed: false; retryAfterSeconds: number; nextAllowedAt: number };

// Checks if a request is within the rate limit window
export function checkWindow(key: string): WindowCheck {
  const now = Date.now();
  const last = lastAllowedAt.get(key) ?? 0;
  const elapsed = now - last;

  // If outside the window, allow the request and update the timestamp
  if (elapsed >= WINDOW_MS) {
    lastAllowedAt.set(key, now);
    return {
      allowed: true,
      retryAfterSeconds: 0,
      nextAllowedAt: Math.floor((now + WINDOW_MS) / 1000),
    };
  }

  // If within the window, reject the request
  const retryAfterMs = WINDOW_MS - elapsed;
  return {
    allowed: false,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    nextAllowedAt: Math.floor((now + retryAfterMs) / 1000),
  };
}

// Increases purchases for a specific client and returns the new count
export function incClient(clientId: string): number {
  const next = (purchasesByClient.get(clientId) ?? 0) + 1;
  purchasesByClient.set(clientId, next);
  totalSold += 1;
  return next;
}

// Increases global purchases and returns the new total
export function globalCornCounter(): number {
  totalSold += 1;
  return totalSold;
}

export function getClientCount(clientId: string): number {
  return purchasesByClient.get(clientId) ?? 0;
}

export function getTotalSold(): number {
  return totalSold;
}
