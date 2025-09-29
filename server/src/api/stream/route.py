from fastapi import APIRouter
from . import schema

stream_routes = APIRouter(
  prefix="/stream",
  tags=["Stream"]
)



@stream_routes.post("/gtm")
async def get_gtm_data(data: schema.GTMSchema):
  return {"message": "gtm"}


@stream_routes.post("/trustpilot")
async def get_trustpilot_data(data: schema.TrustPilotSchema):
  return {"message": "trustpilot"}
