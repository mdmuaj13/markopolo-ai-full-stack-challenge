from typing import List
from . import schema
from datetime import datetime

def generate_comprehensive_response(
    message: str, data_sources: List[schema.DataSource], channels: List[str] = None
) -> str:
    """Generate a comprehensive response based on input parameters with actionable data"""

    # Generate actionable content for each channel
    actionable_blocks = []

    if channels:
        for channel in channels:
            if channel == "email":
                actionable_blocks.append(f"""--actionable--
{{
  "time": "{datetime.now().isoformat()}",
  "message": "Stock clearance offer.. Crafted email message here.",
  "channel": "email",
  "audience": [
    {{
      "email": "customer1@example.com",
      "name": "John Doe"
    }},
    {{
      "email": "customer2@example.com",
      "name": "Jane Smith"
    }}
  ]
}}
--actionable--""")

            elif channel == "sms":
                actionable_blocks.append(f"""--actionable--
{{
  "time": "{datetime.now().isoformat()}",
  "message": "Limited time offer! Shop now and save up to 50%. Reply STOP to opt out.",
  "channel": "sms",
  "audience": [
    {{
      "phone": "+1234567890",
      "name": "John Doe"
    }},
    {{
      "phone": "+1987654321",
      "name": "Jane Smith"
    }}
  ]
}}
--actionable--""")

            elif channel == "whatsapp":
                actionable_blocks.append(f"""--actionable--
{{
  "time": "{datetime.now().isoformat()}",
  "message": "Hi! We have an exclusive offer just for you. Check out our latest collection with special discounts!",
  "channel": "whatsapp",
  "audience": [
    {{
      "phone": "+1234567890",
      "name": "John Doe"
    }},
    {{
      "phone": "+1987654321",
      "name": "Jane Smith"
    }}
  ]
}}
--actionable--""")

    # Build the response with actionable blocks
    actionable_content = "\n\n".join(actionable_blocks) if actionable_blocks else ""

    response = f"""
This is a simulated AI assistant that can help you with various tasks including:

1. **Data Analysis**: I can analyze data from multiple sources you've provided including {", ".join([ds.name for ds in data_sources]) if data_sources else "various sources"}.

2. **Multi-Channel Communication**: {"Your selected channels (" + ", ".join(channels) + ") will be used for distributing this information." if channels else "I can communicate through multiple channels when configured."}

3. **Real-time Processing**: This streaming response demonstrates real-time processing capabilities, allowing for immediate feedback and interaction.

This streaming response is designed to simulate a real AI assistant that can:
- Process complex queries
- Access multiple data sources simultaneously
- Provide real-time feedback
- Adapt responses based on available context
- Stream information as it becomes available
- Extract actionable insights from conversations
{actionable_content}
Thank you for your query, and I'm here to help with any follow-up questions or additional analysis you might need.
    """.strip()

    return response