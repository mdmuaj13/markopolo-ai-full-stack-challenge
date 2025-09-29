from pydantic import BaseModel

class WebsiteSchema(BaseModel):
  url: str
  
class GTMSchema(BaseModel):
  url: str
  
class TrustPilotSchema(BaseModel):
  url: str
  