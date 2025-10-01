from pydantic import BaseModel, EmailStr
from typing import List, Optional

class EmailRecipient(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class BulkEmailSchema(BaseModel):
    recipients: List[EmailRecipient]
    subject: str
    body: str
    from_email: EmailStr
    from_name: Optional[str] = None

class EmailStatusSchema(BaseModel):
    campaign_id: str
