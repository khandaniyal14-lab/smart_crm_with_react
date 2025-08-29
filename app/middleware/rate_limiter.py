import time
from typing import Dict
from fastapi import HTTPException, status
from app.models.user import User
from app.models.organization import SubscriptionTier

class RateLimiter:
    """
    Rate limiter service that enforces subscription-tier-based limits per user.
    """

    # Example limits: requests per minute
    TIER_LIMITS = {
        SubscriptionTier.FREE: 10,
        SubscriptionTier.BASIC: 50,
        SubscriptionTier.PREMIUM: 200,
    }

    def __init__(self):
        # Store user request timestamps: {user_id: {endpoint: [timestamps]}}
        self.requests: Dict[str, Dict[str, list]] = {}

    async def check_rate_limit(self, user: User, endpoint: str):
        """
        Raises HTTPException if user exceeds their rate limit.
        """
        now = time.time()
        limit = self.TIER_LIMITS.get(user.organization.subscription_tier, 10)
        window = 60  # seconds

        user_requests = self.requests.setdefault(str(user.id), {}).setdefault(endpoint, [])

        # Remove timestamps older than window
        user_requests = [t for t in user_requests if now - t < window]
        self.requests[str(user.id)][endpoint] = user_requests

        if len(user_requests) >= limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Max {limit} requests per minute."
            )

        # Record current request
        user_requests.append(now)
