from typing import List
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from . import schema, service

stream_routes = APIRouter(
    prefix="/stream",
    tags=["Stream"]
)


@stream_routes.post("/chat")
async def stream_chat_response(request: Request, data: schema.ChatSchema):
    """
    Stream chat response using Server-Sent Events (SSE)
    Streams a comprehensive response over approximately 20 seconds

    This endpoint establishes the SSE connection and returns the event stream.
    """
    return EventSourceResponse(service.chat_stream_generator(request, data))


@stream_routes.post("/tools")
async def stream_tool_response(data: List[schema.DataSource]):
    """
    Process data from multiple sources and return combined results.
    
    Args:
        data: List of data sources to process. Each source should have:
            - name: Type of data source ('crm', 'website', or 'facebook_page')
            - data: Dictionary containing source-specific parameters
                - For 'website' and 'facebook_page', include 'url' in the data
                
    Returns:
        Dictionary containing:
        - sources_processed: Number of successfully processed sources
        - data: Dictionary with processed data from each source
    """
    if not isinstance(data, list):
        data = [data]  # Convert single item to list for backward compatibility
        
    return await service.get_data_from_tools(data)
