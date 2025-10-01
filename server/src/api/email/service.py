import random
import uuid
from datetime import datetime
from typing import List, Dict
from . import schema

# In-memory storage for demo purposes
email_campaigns: Dict[str, dict] = {}

async def send_bulk_email(data: schema.BulkEmailSchema) -> dict:
    """Send bulk emails to multiple recipients"""
    campaign_id = str(uuid.uuid4())

    # Simulate sending emails
    results = []
    for recipient in data.recipients:
        # Simulate random success/failure
        status = random.choice(["sent", "sent", "sent", "failed"])  # 75% success rate

        results.append({
            "email": recipient.email,
            "name": recipient.name,
            "status": status,
            "message_id": f"msg_{uuid.uuid4().hex[:12]}" if status == "sent" else None,
            "error": "Invalid email address" if status == "failed" else None
        })

    # Store campaign data
    campaign_data = {
        "campaign_id": campaign_id,
        "subject": data.subject,
        "from_email": data.from_email,
        "from_name": data.from_name,
        "total_recipients": len(data.recipients),
        "sent_count": len([r for r in results if r["status"] == "sent"]),
        "failed_count": len([r for r in results if r["status"] == "failed"]),
        "created_at": datetime.now().isoformat(),
        "results": results
    }

    email_campaigns[campaign_id] = campaign_data

    return {
        "campaign_id": campaign_id,
        "status": "completed",
        "total_recipients": campaign_data["total_recipients"],
        "sent_count": campaign_data["sent_count"],
        "failed_count": campaign_data["failed_count"],
        "results": results
    }


def get_campaign_status(campaign_id: str) -> dict:
    """Get status of a bulk email campaign"""
    campaign = email_campaigns.get(campaign_id)

    if not campaign:
        return {
            "error": "Campaign not found",
            "campaign_id": campaign_id
        }

    return {
        "campaign_id": campaign["campaign_id"],
        "subject": campaign["subject"],
        "from_email": campaign["from_email"],
        "from_name": campaign["from_name"],
        "total_recipients": campaign["total_recipients"],
        "sent_count": campaign["sent_count"],
        "failed_count": campaign["failed_count"],
        "created_at": campaign["created_at"],
        "status": "completed"
    }


def get_all_campaigns() -> dict:
    """Get all email campaigns"""
    campaigns_list = [
        {
            "campaign_id": campaign_id,
            "subject": data["subject"],
            "total_recipients": data["total_recipients"],
            "sent_count": data["sent_count"],
            "failed_count": data["failed_count"],
            "created_at": data["created_at"]
        }
        for campaign_id, data in email_campaigns.items()
    ]

    # Sort by created_at (newest first)
    campaigns_list.sort(key=lambda x: x["created_at"], reverse=True)

    return {
        "total_campaigns": len(campaigns_list),
        "campaigns": campaigns_list
    }
