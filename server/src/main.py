import asyncio
import json
import random
from datetime import datetime
from enum import Enum
from typing import Dict

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse


class MarkdownType(str, Enum):
    HEADER = "header"
    PARAGRAPH = "paragraph"
    LIST = "list"
    CODE = "code"
    QUOTE = "quote"
    TABLE = "table"
    DIVIDER = "divider"


# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware to allow requests from our Next.js frontend
# This is crucial for development when frontend and backend are on different ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def generate_markdown_data() -> Dict[str, str]:
    """
    Generates a markdown document with various markdown elements.
    
    Returns:
        Dict[str, str]: A dictionary containing the markdown content and its type.
    """
    # Different types of markdown content
    content_types = [
        ("# Header 1\nThis is a main heading\n", MarkdownType.HEADER),
        ("## Subheader\nThis is a subheading\n", MarkdownType.HEADER),
        ("This is a regular paragraph with some **bold** and *italic* text.", MarkdownType.PARAGRAPH),
        ("- Item 1\n- Item 2\n  - Nested item 1\n  - Nested item 2\n- Item 3", MarkdownType.LIST),
        ("```python\ndef hello_world():\n    print(\"Hello, world!\")\n```", MarkdownType.CODE),
        ("> This is a blockquote.\n> It can span multiple lines.", MarkdownType.QUOTE),
        ("| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |", MarkdownType.TABLE),
        ("---", MarkdownType.DIVIDER)
    ]

    # Select a random markdown content type
    content, content_type = random.choice(content_types)
    
    return {
        "content": content,
        "type": content_type.value,
        "timestamp": datetime.now().isoformat()
    }
# This is our event generator. It will run in a loop,
# yielding data whenever it's ready.
async def markdown_event_generator(request: Request):
    """
    Generates server-sent events with markdown content. The loop will stop if the client disconnects.
    """
    count = 0
    while True:
        # Check if the client has disconnected
        if await request.is_disconnected():
            print("Markdown client disconnected.")
            break

        # Generate markdown data
        count += 1
        markdown_data = generate_markdown_data()
        markdown_data["id"] = count
        
        # Convert to JSON string
        json_data = json.dumps(markdown_data)

        # Yield the data in the format required by SSE
        yield {"data": json_data}

        # Wait for 1-3 seconds before sending the next markdown chunk
        await asyncio.sleep(random.uniform(1.0, 3.0))


async def event_generator(request: Request):
    """
    Generates server-sent events. The loop will stop if the client disconnects.
    """
    count = 0
    while True:
        # Check if the client has disconnected
        if await request.is_disconnected():
            print("Client disconnected.")
            break

        # Create some dummy data
        count += 1
        json_data = json.dumps(
            {
                "id": count,
                "message": f"Hello! This is message #{count}",
                "value": random.randint(1, 100),
                "timestamp": datetime.now().isoformat(),
            }
        )

        # Yield the data in the format required by SSE
        yield {"data": json_data}

        # Wait for 1 second before sending the next event
        await asyncio.sleep(1)


# Define the SSE endpoints
@app.get("/stream")
async def stream_events(request: Request):
    """
    This endpoint establishes the SSE connection and returns the event stream.
    """
    return EventSourceResponse(markdown_event_generator(request))
    # return EventSourceResponse(event_generator(request))


@app.get("/markdown-stream")
async def markdown_stream_events(request: Request):
    """
    This endpoint establishes an SSE connection that streams markdown content.
    """
    return EventSourceResponse(markdown_event_generator(request))


# A simple root endpoint to check if the server is running
@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI server is running"}
