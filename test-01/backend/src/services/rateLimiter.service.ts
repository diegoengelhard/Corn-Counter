const RATE_LIMIT_WINDOW = 60_000;

// Last allowed request timestamp by clientId
const lastAllowedAt = new Map<string, number>();

// Counter for purchases by clientId
const purchasesByClient = new Map<string, number>();

// Global corn sold counter 
let totalSold = 0;

export type WindowCheck =
  | { allowed: true; retryAfterSeconds: 0; nextAllowedAt: number }
  | { allowed: false; retryAfterSeconds: number; nextAllowedAt: number };

/*
  Checks if a request from a clientId is within the allowed rate limit window.
  If allowed, updates the last allowed timestamp.
  @param key - The clientId to check
  @returns An object indicating if the request is allowed, retry time, and next allowed timestamp
*/
export function checkWindow(key: string): WindowCheck {
  const now = Date.now(); // obtains current timestamp
  const last = lastAllowedAt.get(key) ?? 0; // last allowed timestamp for the client
  const elapsed = now - last; // time since last allowed request

  // If outside the window, allow the request and update the timestamp
  if (elapsed >= RATE_LIMIT_WINDOW) {
    lastAllowedAt.set(key, now);
    return {
      allowed: true,
      retryAfterSeconds: 0,
      nextAllowedAt: Math.floor((now + RATE_LIMIT_WINDOW) / 1000),
    };
  }

  // If within the window, reject the request
  const retryAfterMs = RATE_LIMIT_WINDOW - elapsed;
  return {
    allowed: false,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    nextAllowedAt: Math.floor((now + retryAfterMs) / 1000),
  };
}

/*
  Increases the purchase count for a clientId and the global total sold.
  @param clientId - The client identifier
  @returns The new purchase count for the client
*/
export function increasePurchaseAmount(clientId: string): number {
  const next = (purchasesByClient.get(clientId) ?? 0) + 1;
  purchasesByClient.set(clientId, next);
  totalSold += 1;
  return next;
}

/*
  Increases the global corn sold counter by 1.
  @returns The new total sold count
*/
export function globalCornCounter(): number {
  totalSold += 1;
  return totalSold;
}

/*
  Retrieves the purchase count for a specific clientId.
  @param clientId - The client identifier
  @returns The purchase count for the client
*/
export function getClientCount(clientId: string): number {
  return purchasesByClient.get(clientId) ?? 0;
}

/*
  Retrieves the total corn sold count.
  @returns The total sold count
*/
export function getTotalSold(): number {
  return totalSold;
}
