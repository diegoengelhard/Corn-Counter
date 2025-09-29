export interface IBuyCornSuccess {
  ok: true;
  purchased: number;
  clientId: string;
  count: number;
  totalSold: number;
  nextAllowedAt: number;
}

export interface IBuyCornError {
  ok: false;
  error: string;
  retryAfterSeconds: number;
  nextAllowedAt: number;
  clientId: string;
  count: number;
  totalSold: number;
}

export type IBuyCornResponse = IBuyCornSuccess | IBuyCornError;

export interface IClientInfoResponse {
  ok: true;
  clientId: string;
  count: number;
  totalSold: number;
  retryAfterSeconds: number;
  nextAllowedAt: number;  
}

export interface IApiError {
  ok: false;
  error: string;
}
