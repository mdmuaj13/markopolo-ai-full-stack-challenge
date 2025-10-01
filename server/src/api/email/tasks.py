import random
import uuid
import time
from datetime import datetime
from typing import List, Dict
from celery import Task
from src.celery_app import celery_app
from . import schema

# In-memory storage for demo purposes
email_campaigns: Dict[str, dict] = {}


class EmailTask(Task):
    """Custom task class with retry logic"""

    autoretry_for = (Exception,)
    retry_kwargs = {"max_retries": 3, "countdown": 60}
    retry_backoff = True
    retry_backoff_max = 600
    retry_jitter = True


@celery_app.task(bind=True, base=EmailTask, name="send_bulk_email_task")
def send_bulk_email_task(
    self,
    campaign_id: str,
    subject: str,
    body: str,
    from_email: str,
    from_name: str,
    recipients: List[Dict],
) -> dict:
    try:
        # Update campaign status to processing
        email_campaigns[campaign_id] = {
            "campaign_id": campaign_id,
            "subject": subject,
            "from_email": from_email,
            "from_name": from_name,
            "total_recipients": len(recipients),
            "sent_count": 0,
            "failed_count": 0,
            "created_at": datetime.now().isoformat(),
            "status": "processing",
            "task_id": self.request.id,
            "results": [],
        }

        # Simulate sending emails
        results = []
        sent_count = 0
        failed_count = 0

        for idx, recipient in enumerate(recipients):
            try:
                # Simulate random success/failure (75% success rate)
                status = random.choice(["sent", "sent", "sent", "failed"])

                result = {
                    "email": recipient["email"],
                    "name": recipient["name"],
                    "status": status,
                    "message_id": f"msg_{uuid.uuid4().hex[:12]}"
                    if status == "sent"
                    else None,
                    "error": "Invalid email address" if status == "failed" else None,
                    "timestamp": datetime.now().isoformat(),
                }

                results.append(result)

                if status == "sent":
                    sent_count += 1
                else:
                    failed_count += 1

                # Update progress periodically (every 10 emails or at the end)
                if (idx + 1) % 10 == 0 or (idx + 1) == len(recipients):
                    self.update_state(
                        state="PROGRESS",
                        meta={
                            "current": idx + 1,
                            "total": len(recipients),
                            "sent_count": sent_count,
                            "failed_count": failed_count,
                            "status": "processing",
                        },
                    )

            except Exception as e:
                # Handle individual email failures
                failed_count += 1
                results.append(
                    {
                        "email": recipient.get("email", "unknown"),
                        "name": recipient.get("name", "unknown"),
                        "status": "failed",
                        "message_id": None,
                        "error": str(e),
                        "timestamp": datetime.now().isoformat(),
                    }
                )

        # Update campaign with final results
        campaign_data = {
            "campaign_id": campaign_id,
            "subject": subject,
            "from_email": from_email,
            "from_name": from_name,
            "total_recipients": len(recipients),
            "sent_count": sent_count,
            "failed_count": failed_count,
            "created_at": email_campaigns[campaign_id]["created_at"],
            "completed_at": datetime.now().isoformat(),
            "status": "completed",
            "task_id": self.request.id,
            "results": results,
        }

        email_campaigns[campaign_id] = campaign_data

        return {
            "campaign_id": campaign_id,
            "status": "completed",
            "total_recipients": len(recipients),
            "sent_count": sent_count,
            "failed_count": failed_count,
            "task_id": self.request.id,
        }

    except Exception as e:
        # Update campaign status to failed
        if campaign_id in email_campaigns:
            email_campaigns[campaign_id].update(
                {
                    "status": "failed",
                    "error": str(e),
                    "failed_at": datetime.now().isoformat(),
                }
            )

        # Retry the task
        raise self.retry(exc=e)


def get_task_status(task_id: str) -> dict:
    """Get the status of a Celery task"""
    task_result = celery_app.AsyncResult(task_id)

    response = {"task_id": task_id, "status": task_result.state, "result": None}

    if task_result.state == "PENDING":
        response["result"] = {
            "status": "pending",
            "message": "Task is waiting to be processed",
        }
    elif task_result.state == "PROGRESS":
        response["result"] = task_result.info
    elif task_result.state == "SUCCESS":
        response["result"] = task_result.result
    elif task_result.state == "FAILURE":
        response["result"] = {"status": "failed", "error": str(task_result.info)}
    elif task_result.state == "RETRY":
        response["result"] = {
            "status": "retrying",
            "message": "Task is being retried after a failure",
        }

    return response


@celery_app.task(bind=True, name="schedule_campaign_task")
def schedule_campaign_task(
    self,
    campaign_id: str,
    scheduled_time: str,
    message: str,
    recipients: List[Dict],
) -> dict:
    """Scheduled campaign task that simulates bulk email processing"""
    try:
        # Update campaign status to processing
        if campaign_id in email_campaigns:
            email_campaigns[campaign_id]["status"] = "processing"
            email_campaigns[campaign_id]["task_id"] = self.request.id
            email_campaigns[campaign_id]["processing_started_at"] = datetime.now().isoformat()

        # Simulate processing delay
        time.sleep(2)

        # Simulate sending emails to recipients
        results = []
        sent_count = 0
        failed_count = 0

        for idx, recipient in enumerate(recipients):
            # Simulate random success/failure (90% success rate for demo)
            status = random.choice(["sent"] * 9 + ["failed"])

            result = {
                "email": recipient["email"],
                "name": recipient["name"],
                "status": status,
                "message_id": f"sim_{uuid.uuid4().hex[:12]}" if status == "sent" else None,
                "error": "Simulated delivery failure" if status == "failed" else None,
                "timestamp": datetime.now().isoformat(),
            }

            results.append(result)

            if status == "sent":
                sent_count += 1
            else:
                failed_count += 1

            # Update progress
            if (idx + 1) % 5 == 0 or (idx + 1) == len(recipients):
                self.update_state(
                    state="PROGRESS",
                    meta={
                        "current": idx + 1,
                        "total": len(recipients),
                        "sent_count": sent_count,
                        "failed_count": failed_count,
                        "status": "processing",
                    },
                )

            # Simulate processing time per email
            time.sleep(0.1)

        # Update campaign with final results
        if campaign_id in email_campaigns:
            email_campaigns[campaign_id].update({
                "sent_count": sent_count,
                "failed_count": failed_count,
                "completed_at": datetime.now().isoformat(),
                "status": "completed",
                "results": results,
            })

        return {
            "campaign_id": campaign_id,
            "status": "completed",
            "total_recipients": len(recipients),
            "sent_count": sent_count,
            "failed_count": failed_count,
            "task_id": self.request.id,
            "message": "Campaign completed successfully (simulated)",
        }

    except Exception as e:
        # Update campaign status to failed
        if campaign_id in email_campaigns:
            email_campaigns[campaign_id].update({
                "status": "failed",
                "error": str(e),
                "failed_at": datetime.now().isoformat(),
            })
        raise
