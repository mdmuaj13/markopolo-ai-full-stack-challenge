from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import re
import json

class DataSource(BaseModel):
    name: str
    data: Dict = {}

class Audience(BaseModel):
    email: str
    name: str

class ActionableData(BaseModel):
    time: str
    message: str
    channel: str
    audience: List[Audience]

class ParsedResponse(BaseModel):
    text_content: str
    actionable_data: Optional[ActionableData] = None

class ChatSchema(BaseModel):
    message: str
    data_source: List[DataSource]
    channel: List[str] | None = None

def parse_actionable_content(text: str) -> ParsedResponse:
    """
    Parse text content to extract actionable data patterns.
    Looks for patterns like --actionable-- json --actionable--
    """
    # Pattern to match actionable content
    pattern = r'--actionable--(.*?)--actionable--'

    actionable_match = re.search(pattern, text, re.DOTALL)

    if actionable_match:
        # Extract the actionable content
        actionable_text = actionable_match.group(1).strip()

        # Try to parse as JSON
        try:
            # Remove code block markers if present
            if actionable_text.startswith('```json'):
                actionable_text = actionable_text[7:]
            if actionable_text.endswith('```'):
                actionable_text = actionable_text[:-3]

            actionable_text = actionable_text.strip()
            actionable_json = json.loads(actionable_text)

            # Convert to ActionableData model
            actionable_data = ActionableData(**actionable_json)

            # Remove actionable content from text
            clean_text = re.sub(pattern, '', text, flags=re.DOTALL).strip()

            return ParsedResponse(
                text_content=clean_text,
                actionable_data=actionable_data
            )

        except (json.JSONDecodeError, Exception) as e:
            # If parsing fails, return original text
            print(f"Failed to parse actionable content: {e}")
            return ParsedResponse(text_content=text)

    return ParsedResponse(text_content=text)
