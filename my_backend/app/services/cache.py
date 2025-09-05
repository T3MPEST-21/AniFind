import aioredis
import json

REDIS_URL = "redis://localhost:6379"

async def get_redis():
    return await aioredis.create_redis_pool(REDIS_URL)

async def cache_get(key):
    redis = await get_redis()
    value = await redis.get(key)
    redis.close()
    await redis.wait_closed()
    if value:
        return json.loads(value)
    return None

async def cache_set(key, value, expire=60):
    redis = await get_redis()
    await redis.set(key, json.dumps(value), expire=expire)
    redis.close()
    await redis.wait_closed()
