from uuid import UUID
from sqlalchemy.orm import Session
from app.models.organization import Organization, SubscriptionTier
from app.models.database import get_db
from fastapi import HTTPException, status

class SubscriptionService:
    """
    Handles subscription tier checks and upgrades for organizations.
    """

    # Example feature mapping per subscription tier
    FEATURE_MATRIX = {
        SubscriptionTier.FREE: ["basic_dashboard", "limited_leads"],
        SubscriptionTier.BASIC: ["basic_dashboard", "limited_leads", "ai_scoring"],
        SubscriptionTier.PREMIUM: ["basic_dashboard", "limited_leads", "ai_scoring", "priority_support"],
    }

    def check_feature_access(self, org: Organization, feature: str) -> bool:
        """
        Returns True if the organization's subscription tier allows access to the feature.
        """
        allowed_features = self.FEATURE_MATRIX.get(org.subscription_tier, [])
        return feature in allowed_features

    async def upgrade_subscription(self, org_id: UUID, new_tier: SubscriptionTier, db: Session):
        """
        Upgrade an organization's subscription tier.
        """
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

        # Check if new tier is actually higher than current
        tier_order = [SubscriptionTier.FREE, SubscriptionTier.BASIC, SubscriptionTier.PREMIUM]
        current_index = tier_order.index(org.subscription_tier)
        new_index = tier_order.index(new_tier)
        if new_index <= current_index:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot downgrade or reapply the same tier"
            )

        # Upgrade subscription
        org.subscription_tier = new_tier
        db.commit()
        db.refresh(org)
        return org
