import { IBuyCornResponse, IClientInfoResponse } from '../ts/interfaces';

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/rate-limiter'; 

/**
 * Obtains client information from the server.
 * @param clientId - The client's identifier.
 * @returns A promise that resolves to the client information.
 */
export const getClientInfo = async (clientId: string): Promise<IClientInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      'X-Client-Id': clientId,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch client info');
  }

  return response.json();
};

/**
 * Attempts to purchase corn for the specified client.
 * @param clientId - The client's identifier.
 * @returns A promise that resolves to the purchase response, which may indicate success or rate limiting.
 */
export const buyCorn = async (clientId: string): Promise<IBuyCornResponse> => {
    const response = await fetch(`${API_BASE_URL}/buy`, {
        method: 'POST',
        headers: {
            'X-Client-Id': clientId,
        },
    });

    // A 429 is not treated as an error because it's an expected response with useful data (e.g., retryAfterSeconds).
    return response.json();
};
