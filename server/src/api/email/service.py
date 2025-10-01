import uuid
from datetime import datetime
from typing import Dict
from . import schema
from .tasks import send_bulk_email_task, get_task_status, email_campaigns, schedule_campaign_task


async def send_bulk_email(data: schema.BulkEmailSchema) -> dict:
    """Queue bulk email sending task in Celery"""
    campaign_id = str(uuid.uuid4())

    # Prepare recipients data for Celery task
    recipients_data = [
        {"email": recipient.email, "name": recipient.name}
        for recipient in data.audience
    ]

    # Queue the task in Celery
    task = send_bulk_email_task.delay(
        campaign_id=campaign_id,
        subject=f"Email Campaign - {data.time}",
        body=data.message,
        from_email="noreply@example.com",  # Default sender
        from_name="Marketing Team",
        recipients=recipients_data
    )

    return {
        "campaign_id": campaign_id,
        "task_id": task.id,
        "status": "queued",
        "message": "Bulk email task has been queued for processing",
        "total_recipients": len(data.audience),
        "channel": data.channel,
        "scheduled_time": data.time
    }


def get_campaign_status(campaign_id: str) -> dict:
    """Get status of a bulk email campaign"""
    campaign = email_campaigns.get(campaign_id)

    if not campaign:
        return {
            "error": "Campaign not found",
            "campaign_id": campaign_id
        }

    response = {
        "campaign_id": campaign["campaign_id"],
        "subject": campaign["subject"],
        "from_email": campaign["from_email"],
        "from_name": campaign["from_name"],
        "total_recipients": campaign["total_recipients"],
        "sent_count": campaign["sent_count"],
        "failed_count": campaign["failed_count"],
        "created_at": campaign["created_at"],
        "status": campaign["status"]
    }

    # Add task_id if available
    if "task_id" in campaign:
        response["task_id"] = campaign["task_id"]

    # Add completion time if available
    if "completed_at" in campaign:
        response["completed_at"] = campaign["completed_at"]

    # Add error information if available
    if "error" in campaign:
        response["error"] = campaign["error"]
        response["failed_at"] = campaign.get("failed_at")

    return response


def get_all_campaigns() -> dict:
    """Get all email campaigns"""
    campaigns_list = [
        {
            "campaign_id": campaign_id,
            "subject": data["subject"],
            "total_recipients": data["total_recipients"],
            "sent_count": data["sent_count"],
            "failed_count": data["failed_count"],
            "created_at": data["created_at"],
            "status": data["status"],
            "task_id": data.get("task_id")
        }
        for campaign_id, data in email_campaigns.items()
    ]

    # Sort by created_at (newest first)
    campaigns_list.sort(key=lambda x: x["created_at"], reverse=True)

    return {
        "total_campaigns": len(campaigns_list),
        "campaigns": campaigns_list
    }


def get_task_status_service(task_id: str) -> dict:
    """Get the status of a Celery task by task ID"""
    return get_task_status(task_id)


async def create_campaign(data: schema.CampaignCreateSchema) -> dict:
    """Create a campaign and schedule it for execution"""
    campaign_id = str(uuid.uuid4())

    # Prepare recipients data for Celery task
    recipients_data = [
        {"email": recipient.email, "name": recipient.name}
        for recipient in data.audience
    ]

    # Store campaign info
    email_campaigns[campaign_id] = {
        "campaign_id": campaign_id,
        "subject": f"Email Campaign - {data.time}",
        "message": data.message,
        "channel": data.channel,
        "scheduled_time": data.time,
        "total_recipients": len(data.audience),
        "sent_count": 0,
        "failed_count": 0,
        "created_at": datetime.now().isoformat(),
        "status": "scheduled"
    }

    # Schedule the campaign task
    task = schedule_campaign_task.delay(
        campaign_id=campaign_id,
        scheduled_time=data.time,
        message=data.message,
        recipients=recipients_data
    )

    return {
        "campaign_id": campaign_id,
        "task_id": task.id,
        "status": "scheduled",
        "message": "Campaign has been scheduled successfully",
        "scheduled_time": data.time,
        "total_recipients": len(data.audience),
        "channel": data.channel
    }
