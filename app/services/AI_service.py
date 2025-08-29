import random
from typing import Dict

class AIService:
    """
    AI Service placeholder for scoring leads and classifying complaints.
    Replace with your ML model or external API integration.
    """

    async def score_lead(self, lead_data: Dict) -> float:
        """
        Returns a lead score between 0-100.
        You can replace this with an actual ML model prediction.
        """
        # Example: simple heuristic or random score
        name_length = len(lead_data.get("name", ""))
        score = min(100, max(0, name_length * 5 + random.randint(0, 20)))
        return float(score)

    async def classify_complaint(self, complaint_text: str) -> str:
        """
        Returns a complaint classification.
        You can integrate a text classification model here.
        """
        # Example: simple keyword-based classification
        complaint_text_lower = complaint_text.lower()
        if "billing" in complaint_text_lower:
            return "billing_issue"
        elif "service" in complaint_text_lower:
            return "service_issue"
        elif "technical" in complaint_text_lower:
            return "technical_issue"
        else:
            return "unclassified"
