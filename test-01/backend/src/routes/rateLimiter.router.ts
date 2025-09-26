import express, { Request, Response } from 'express';
import {
  buyCorn,
  getClientInfo
} from '../controllers/rateLimiter.controller';

const router = express.Router();

router.post('/buy', buyCorn);
router.get('/me', getClientInfo);

export default router;
