import { Request, Response } from 'express';
import { 
    checkWindow,
    incClient, 
    getClientCount, 
    getTotalSold 
} from '../services/rateLimiter.service';

// Extracts clientId from header or assigns "Guest" if not provided
function getClientId(req: Request): string {
  const clientId = (req.header('X-Client-Id') || '').trim();
  return clientId.length ? clientId : "Guest";
}

// Handles corn purchase requests with rate limiting
export function buyCorn(req: Request, res: Response) {
  const clientId = getClientId(req); // Obtain client ID
  const timeWindow = checkWindow(clientId); // Check rate limit window

  // Rate-limit headers
  res.setHeader('X-RateLimit-Limit', 1);
  res.setHeader('X-RateLimit-Window-Seconds', 60);
  res.setHeader('X-RateLimit-Reset', timeWindow.nextAllowedAt);
  res.setHeader('X-RateLimit-Identity', clientId);
  
  // If rate limit exceeded, respond with 429 status
  if (!timeWindow.allowed) {
    res.setHeader('Retry-After', timeWindow.retryAfterSeconds);
    return res.status(429).json({
      ok: false,
      error: 'Too Many Requests',
      retryAfterSeconds: timeWindow.retryAfterSeconds,
      nextAllowedAt: timeWindow.nextAllowedAt,
      clientId,
      count: getClientCount(clientId),
      totalSold: getTotalSold(),
    });
  }

  // Process the purchase
  const count = incClient(clientId);

  // Successful 200 purchase response
  return res.status(200).json({
    ok: true,
    purchased: 1,
    clientId,
    count,
    totalSold: getTotalSold(),
    nextAllowedAt: timeWindow.nextAllowedAt,
  });
}

// Returns client info including purchase count and total sold corn
export function getClientInfo(req: Request, res: Response) {
  const clientId = getClientId(req); // Obtain client ID
  
  // Respond with client info
  return res.json({
    ok: true,
    clientId,
    count: getClientCount(clientId),
    totalSold: getTotalSold(),
  });
}
