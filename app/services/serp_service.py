from typing import List, Dict
from fastapi import HTTPException, status
import httpx
from app.models.user import User
from app.models.organization import SubscriptionTier
from app.services.subscription_service import SubscriptionService

class SerpAPIService:
    """
    Service to generate leads using SerpAPI.
    Only available for premium subscribers.
    """

    def __init__(self):
        self.subscription_service = SubscriptionService()
        # You can put your SerpAPI key here or read from env
        self.api_key = "YOUR_SERPAPI_KEY"
        self.base_url = "https://serpapi.com/search"

    async def generate_leads(self, user: User, search_query: str, location: str) -> List[Dict]:
        """
        Generate leads from SerpAPI if user subscription allows.
        """
        # Check subscription access
        if not self.subscription_service.check_feature_access(user.organization, "ai_scoring"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Lead generation feature is only available for premium subscribers."
            )

        # Example: Call SerpAPI (replace with real API call)
        params = {
            "q": f"{search_query} in {location}",
            "engine": "google",
            "api_key": self.api_key,
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to fetch leads from SerpAPI"
                )

            data = response.json()
            # Example: extract leads from API response
            leads = [
                {"name": item.get("title"), "email": item.get("email"), "phone": item.get("phone")}
                for item in data.get("organic_results", [])
            ]
        return leads
