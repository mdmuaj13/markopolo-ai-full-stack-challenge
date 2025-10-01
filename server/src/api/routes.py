from fastapi import FastAPI

from .source.route import source_routes
from .stream.route import stream_routes
from .email.route import email_routes

def register_routes(server: FastAPI) -> None:
    @server.get("/health")
    async def health():
        return {"status": "ok"}

    server.include_router(source_routes)
    server.include_router(stream_routes)
    server.include_router(email_routes)
