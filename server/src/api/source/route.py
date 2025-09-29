from fastapi import APIRouter
from . import schema, service

source_routes = APIRouter(prefix="/source", tags=["Source"])


@source_routes.post("/website")
async def get_website_data(data: schema.WebsiteSchema):
    # return { "message": "website"}
    return await service.scrape_website(data.url)


@source_routes.post("/facebook_page")
async def get_facebook_page_data(data: schema.FacebookPageSchema):
    return service.get_facebook_page_mock_data(data.url)


@source_routes.post("/crm")
async def get_crm_data():
    return service.get_crm_mock_data()
