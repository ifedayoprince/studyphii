import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 30, // Number of requests
  duration: 60, // Per 60 seconds
});

export async function checkRateLimit(key: string): Promise<boolean> {
  try {
    await rateLimiter.consume(key);
    return true;
  } catch {
    return false;
  }
}
