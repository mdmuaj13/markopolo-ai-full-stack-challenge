import asyncio
import json
import time
import random
from datetime import datetime
from typing import Dict, List
from fastapi import Request
from . import schema


def generate_comprehensive_response(message: str, data_sources: List[schema.DataSource], channels: List[str] = None) -> str:
    """Generate a comprehensive response based on input parameters with actionable data"""

    # Example response with embedded actionable data
    response = f"""
I'll provide you with a comprehensive analysis and response. This is a simulated AI assistant that can help you with various tasks including:

1. **Data Analysis**: I can analyze data from multiple sources you've provided including {', '.join([ds.name for ds in data_sources]) if data_sources else 'various sources'}.

2. **Multi-Channel Communication**: {"Your selected channels (" + ', '.join(channels) + ") will be used for distributing this information." if channels else "I can communicate through multiple channels when configured."}

3. **Real-time Processing**: This streaming response demonstrates real-time processing capabilities, allowing for immediate feedback and interaction.

After analyzing your request, I've identified some actionable items that need attention:

4. **Contextual Understanding**: I analyze your request in context with available data sources and preferred communication channels to provide the most relevant response.

This streaming response is designed to simulate a real AI assistant that can:
- Process complex queries
- Access multiple data sources simultaneously
- Provide real-time feedback
- Adapt responses based on available context
- Stream information as it becomes available
- Extract actionable insights from conversations

--actionable--
{{
  "time": "{datetime.now().isoformat()}",
  "message": "Stock clearance offer.. Crafted message here.",
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
--actionable--

Thank you for your query, and I'm here to help with any follow-up questions or additional analysis you might need.
    """.strip()

    return response


async def chat_stream_generator(request: Request, chat_data: schema.ChatSchema):
    """
    Generates server-sent events with chat response content over 20 seconds.
    The loop will stop if the client disconnects.
    """

    # Check if the client has disconnected
    if await request.is_disconnected():
        print("Chat client disconnected.")
        return

    # Generate the comprehensive response
    long_response = generate_comprehensive_response(
        message=chat_data.message,
        data_sources=chat_data.data_source,
        channels=chat_data.channel
    )

    # Parse the response to extract actionable content
    parsed_response = schema.parse_actionable_content(long_response)

    # Split the clean text into chunks for streaming
    words = parsed_response.text_content.split(' ')
    total_words = len(words)
    words_per_chunk = max(1, total_words // 30)  # Aim for ~30 chunks over 10 seconds

    # Send start event with actionable data if present
    start_data = {
        'type': 'start',
        'message': 'Starting response stream...',
        'timestamp': datetime.now().isoformat(),
        'total_words': total_words
    }

    if parsed_response.actionable_data:
        start_data['actionable_data'] = parsed_response.actionable_data.dict()

    yield {"data": json.dumps(start_data)}

    # Stream the response in chunks
    current_chunk = ""
    word_count = 0
    chunk_number = 0

    for i, word in enumerate(words):
        # Check if client disconnected during streaming
        if await request.is_disconnected():
            print("Chat client disconnected during streaming.")
            break

        current_chunk += word + " "
        word_count += 1

        # Send chunk every few words or at the end
        if word_count >= words_per_chunk or i == len(words) - 1:
            chunk_number += 1
            chunk_data = {
                'type': 'chunk',
                'content': current_chunk.strip(),
                'progress': round((i + 1) / total_words * 100, 1),
                'chunk_number': chunk_number,
                'timestamp': datetime.now().isoformat()
            }

            yield {"data": json.dumps(chunk_data)}

            # Reset for next chunk
            current_chunk = ""
            word_count = 0

            # Wait to spread over 20 seconds (except for the last chunk)
            if i < len(words) - 1:
                # Add some randomness to make it feel more natural
                base_delay = 20 / 60  # ~60 chunks over 20 seconds
                random_factor = random.uniform(0.8, 1.2)  # �20% variation
                delay = base_delay * random_factor
                await asyncio.sleep(delay)

    # Send completion event with actionable data summary
    completion_data = {
        'type': 'complete',
        'message': 'Response stream completed',
        'total_words': total_words,
        'total_chunks': chunk_number,
        'duration': '~20 seconds',
        'timestamp': datetime.now().isoformat()
    }

    if parsed_response.actionable_data:
        completion_data['actionable_summary'] = {
            'has_actionable_data': True,
            'channel': parsed_response.actionable_data.channel,
            'audience_count': len(parsed_response.actionable_data.audience),
            'message_preview': parsed_response.actionable_data.message[:50] + "..." if len(parsed_response.actionable_data.message) > 50 else parsed_response.actionable_data.message
        }
    else:
        completion_data['actionable_summary'] = {
            'has_actionable_data': False
        }

    yield {"data": json.dumps(completion_data)}


def create_chat_response_data(message: str, data_sources: List[schema.DataSource], channels: List[str] = None) -> Dict:
    """Create a structured chat response data object"""
    return {
        'id': int(time.time() * 1000),  # Unique ID based on timestamp
        'message': message,
        'data_sources': [{'name': ds.name, 'data': ds.data} for ds in data_sources],
        'channels': channels or [],
        'timestamp': datetime.now().isoformat(),
        'status': 'processing'
    }