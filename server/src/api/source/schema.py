from pydantic import BaseModel

class WebsiteSchema(BaseModel):
  url: str
  
class FacebookPageSchema(BaseModel):
  url: str
  