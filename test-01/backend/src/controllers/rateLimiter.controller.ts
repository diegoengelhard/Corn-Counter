import { Request, Response } from 'express';
import { 
    checkWindow,
    increasePurchaseAmount, 
    getClientCount, 
    getTotalSold 
} from '../services/rateLimiter.service';
import {
    IBuyCornResponse,
    IClientInfoResponse,
} from "../ts/interfaces";

/*
Extracts the client ID from request headers or defaults to "Guest".
@param req - The Express request object
@returns The client identifier
*/
function getClientId(req: Request): string {
  const clientId = (req.header('X-Client-Id') || '').trim();
  return clientId.length ? clientId : "Guest";
}

/*
    Handles a corn purchase request, enforcing rate limits.
    Responds with purchase status, client info, and rate limit headers.
*/
export function buyCorn(req: Request, res: Response<IBuyCornResponse>) {
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
  const count = increasePurchaseAmount(clientId);

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

/*
    Retrieves client purchase info.
    Responds with client ID, purchase count, and total sold.
*/
export function getClientInfo(req: Request, res: Response<IClientInfoResponse>) {
  const clientId = getClientId(req); // Obtain client ID
  
  // Respond with client info
  return res.json({
    ok: true,
    clientId,
    count: getClientCount(clientId),
    totalSold: getTotalSold(),
  });
}
