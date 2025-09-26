import { Request, Response } from 'express';
import * as cornService from '../services/rateLimiter.service';

function requireClientId(req: Request): string {
  const id = (req.header('X-Client-Id') || '').trim();
  if (!id) throw new Error('Missing X-Client-Id');
  return id;
}

export function buy(req: Request, res: Response) {
  try {
    const clientId = requireClientId(req);
    const result = cornService.tryBuy(clientId);

    res.setHeader('X-RateLimit-Limit', 1);
    res.setHeader('X-RateLimit-Window-Seconds', 60);
    res.setHeader('X-RateLimit-Reset', result.nextAllowedAt);
    if (!result.allowed) res.setHeader('Retry-After', result.retryAfterSeconds);

    if (!result.allowed) {
      return res.status(429).json({
        ok: false,
        error: 'Too Many Requests',
        retryAfterSeconds: result.retryAfterSeconds,
        nextAllowedAt: result.nextAllowedAt,
      });
    }

    return res.status(200).json({
      ok: true,
      purchased: 1,
      count: result.count,
      nextAllowedAt: result.nextAllowedAt,
    });
  } catch (error: any) {
    return res.status(400).json({ ok: false, error: error?.message || 'Bad Request' });
  }
}

export function me(req: Request, res: Response) {
  try {
    const clientId = requireClientId(req);
    const count = cornService.getCornCount(clientId);
    return res.json({ ok: true, clientId, count });
  } catch (error: any) {
    return res.status(400).json({ ok: false, error: error?.message || 'Bad Request' });
  }
}
