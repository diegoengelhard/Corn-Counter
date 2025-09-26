import express, { Request, Response } from 'express';
import { tryBuy, getCornCount } from '../services/rateLimiter.service';

const router = express.Router();

function requireClientId(req: Request): string {
  const id = (req.header('X-Client-Id') || '').trim();
  if (!id) throw new Error('Missing X-Client-Id header');
  return id;
}

router.post('/buy', (req: Request, res: Response) => {
  try {
    const clientId = requireClientId(req);
    const rateLimitResult = tryBuy(clientId);

    res.setHeader('X-RateLimit-Limit', 1);
    res.setHeader('X-RateLimit-Window-Seconds', 60);
    res.setHeader('X-RateLimit-Reset', rateLimitResult.nextAllowedAt);
    
    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.retryAfterSeconds);
    }

    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        ok: false,
        error: 'Too Many Requests',
        retryAfterSeconds: rateLimitResult.retryAfterSeconds,
        nextAllowedAt: rateLimitResult.nextAllowedAt,
      });
    }

    return res.status(200).json({
      ok: true,
      purchased: 1,
      count: rateLimitResult.count,
      nextAllowedAt: rateLimitResult.nextAllowedAt,
    });
  } catch (error: any) {
    return res.status(400).json({ ok: false, error: error?.message || 'Bad Request' });
  }
});

router.get('/me', (req: Request, res: Response) => {
  try {
    const clientId = requireClientId(req);
    return res.json(
      { 
        ok: true, 
        clientId, 
        count: getCornCount(clientId) 
      }
    );
  } catch (error: any) {
    return res.status(400).json({ ok: false, error: error?.message || 'Bad Request' });
  }
});

export default router;
