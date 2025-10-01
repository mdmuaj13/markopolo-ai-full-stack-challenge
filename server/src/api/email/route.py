from fastapi import APIRouter
from . import schema, service

email_routes = APIRouter(prefix="/email", tags=["Email"])


@email_routes.post("/campaign/create")
async def create_campaign(data: schema.CampaignCreateSchema):
    """Create and schedule a campaign"""
    return await service.create_campaign(data)


@email_routes.post("/bulk")
async def send_bulk_email(data: schema.BulkEmailSchema):
    """Queue bulk email sending task"""
    return await service.send_bulk_email(data)


@email_routes.get("/campaign/{campaign_id}")
async def get_campaign_status(campaign_id: str):
    """Get campaign status by campaign ID"""
    return service.get_campaign_status(campaign_id)


@email_routes.get("/campaigns")
async def get_all_campaigns():
    """Get all email campaigns"""
    return service.get_all_campaigns()


@email_routes.get("/task/{task_id}")
async def get_task_status(task_id: str):
    """Get Celery task status by task ID"""
    return service.get_task_status_service(task_id)
