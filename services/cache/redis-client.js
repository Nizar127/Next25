// backend/services/cache-service/redis-client.js
import Redis from 'ioredis';
import { Cluster } from 'ioredis';

const redis = process.env.IS_CLUSTER === 'true'
  ? new Cluster([{ host: process.env.REDIS_HOST }])
  : new Redis(process.env.REDIS_URL);

export const cache = {
  get: async (key) => {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  },
  set: async (key, value, ttl = 3600) => {
    await redis.setex(key, ttl, JSON.stringify(value));
  }
};