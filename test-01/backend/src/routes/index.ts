import express, { Request, Response } from 'express';
const router = express.Router();

import rateLimiterRouter from "./rateLimiter.router"

// Mount the rate limiter router
router.use('/rate-limiter', rateLimiterRouter);

export default router;
