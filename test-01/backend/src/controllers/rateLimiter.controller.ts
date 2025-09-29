import { Request, Response } from "express";
import {
  buyCorn as buyCornService,
  getClientInfo as getClientInfoService,
} from "../services/rateLimiter.service";
import {
  IBuyCornResponse,
  IClientInfoResponse,
  IApiError,
} from "../ts/interfaces";

/*
Extracts the client ID from request headers or defaults to "Guest".
@param req - The Express request object
@returns The client identifier
*/
function getClientId(req: Request): string {
  const clientId = (req.header("X-Client-Id") || "").trim();
  return clientId.length ? clientId : "Guest";
}

export function buyCorn(
  req: Request,
  res: Response<IBuyCornResponse | IApiError>
) {
  try {
    const clientId = getClientId(req);
    const result = buyCornService(clientId);

    // Set rate-limit headers
    res.setHeader("X-RateLimit-Limit", 1);
    res.setHeader("X-RateLimit-Window-Seconds", 60);
    res.setHeader("X-RateLimit-Reset", result.nextAllowedAt);
    res.setHeader("X-RateLimit-Identity", clientId);

    if (!result.ok) {
      res.setHeader("Retry-After", result.retryAfterSeconds);
      return res.status(429).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Internal Server Error",
    });
  }
}

export function getClientInfo(
  req: Request,
  res: Response<IClientInfoResponse | IApiError>
) {
  try {
    const clientId = getClientId(req); // Extract client ID from headers or default to "Guest"
    const result = getClientInfoService(clientId); // Call service to get client info
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Internal Server Error",
    });
  }
}
