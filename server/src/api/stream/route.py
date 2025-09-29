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
