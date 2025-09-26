const WINDOW_MS = 60_000;
const lastBuyAt = new Map<string, number>();
const purchases = new Map<string, number>();

export type RateResult =
  | { allowed: true; retryAfterSeconds: 0; nextAllowedAt: number; count: number }
  | { allowed: false; retryAfterSeconds: number; nextAllowedAt: number };

export function tryBuy(clientId: string): RateResult {
  const now = Date.now();
  const last = lastBuyAt.get(clientId) ?? 0;
  const elapsed = now - last;

  if (elapsed >= WINDOW_MS) {
    lastBuyAt.set(clientId, now);
    const newCount = (purchases.get(clientId) ?? 0) + 1;
    purchases.set(clientId, newCount);

    return { 
      allowed: true, 
      retryAfterSeconds: 0, 
      nextAllowedAt: Math.floor((now + WINDOW_MS)/1000), 
      count: newCount 
    };
  }

  const retryAfterMs = WINDOW_MS - elapsed;
  return { 
    allowed: false, 
    retryAfterSeconds: Math.ceil(retryAfterMs/1000), 
    nextAllowedAt: Math.floor((now + retryAfterMs)/1000) 
  };
}

export function getCornCount(clientId: string): number {
  return purchases.get(clientId) ?? 0;
}
