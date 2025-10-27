from functools import lru_cache
import redis
import os
from dotenv import load_dotenv
import json

load_dotenv()

class CacheManager:
    def __init__(self):
        self.redis_client = None
        self.use_redis = os.getenv("USE_REDIS", "false").lower() == "true"
        
        if self.use_redis:
            try:
                self.redis_client = redis.Redis(
                    host=os.getenv("REDIS_HOST", "localhost"),
                    port=int(os.getenv("REDIS_PORT", 6379)),
                    db=0,
                    decode_responses=True
                )
                self.redis_client.ping()
                print("Redis cache enabled")
            except Exception as e:
                print(f"Redis connection failed, falling back to LRU cache: {e}")
                self.use_redis = False
    
    @lru_cache(maxsize=1000)
    def get_cached_lru(self, key):
        # This will be used if Redis is not available
        return None
    
    def set_cached_lru(self, key, value):
        # LRU cache is handled automatically by the decorator
        pass
    
    def get(self, key):
        if self.use_redis and self.redis_client:
            cached = self.redis_client.get(key)
            return json.loads(cached) if cached else None
        else:
            return self.get_cached_lru(key)
    
    def set(self, key, value, expire_seconds=3600):
        if self.use_redis and self.redis_client:
            self.redis_client.setex(key, expire_seconds, json.dumps(value))
        else:
            # For LRU cache, we can't set expiration, but the decorator handles size
            self.set_cached_lru(key, value)
    
    def generate_cache_key(self, fen: str, prompt_type: str) -> str:
        return f"{prompt_type}:{fen}"

cache_manager = CacheManager()
