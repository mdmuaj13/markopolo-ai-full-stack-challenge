from fastapi import APIRouter
from . import schema, service

email_routes = APIRouter(prefix="/email", tags=["Email"])


@email_routes.post("/bulk")
async def send_bulk_email(data: schema.BulkEmailSchema):
    return await service.send_bulk_email(data)


@email_routes.get("/campaign/{campaign_id}")
async def get_campaign_status(campaign_id: str):
    return service.get_campaign_status(campaign_id)


@email_routes.get("/campaigns")
async def get_all_campaigns():
    return service.get_all_campaigns()
