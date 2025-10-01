from pydantic import BaseModel, EmailStr
from typing import List, Optional

class EmailRecipient(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class BulkEmailSchema(BaseModel):
    time: str
    message: str
    channel: str
    audience: List[EmailRecipient]

class CampaignCreateSchema(BaseModel):
    time: str
    message: str
    channel: str
    audience: List[EmailRecipient]

class EmailStatusSchema(BaseModel):
    campaign_id: str
