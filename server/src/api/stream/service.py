import asyncio
import json
import random
from datetime import datetime
from typing import List
from fastapi import Request
from . import schema
from ..source.service import (
    scrape_website,
    get_facebook_page_mock_data,
    get_crm_mock_data,
)
from .generatellmservice import generate_comprehensive_response


async def chat_stream_generator(request: Request, chat_data: schema.ChatSchema):
    """
    Generates server-sent events with chat response content over 10 seconds.
    The loop will stop if the client disconnects.
    """

    # Check if the client has disconnected
    if await request.is_disconnected():
        print("Chat client disconnected.")
        return
    
    # Process data from tools
    print("Processing data from tools...")
    processed_data = await get_data_from_tools(chat_data.data_source)

    # Generate the comprehensive response
    long_response = generate_comprehensive_response(
        message=chat_data.message,
        data_sources=processed_data,
        channels=chat_data.channel,
    )

    # Parse the response to extract actionable content
    parsed_response = schema.parse_actionable_content(long_response)

    # Split the clean text into chunks for streaming
    words = parsed_response.text_content.split(" ")
    total_words = len(words)
    words_per_chunk = max(1, total_words // 30)  # Aim for ~30 chunks over 10 seconds

    # Send start event with actionable data if present
    start_data = {
        "type": "start",
        "message": "Starting response stream...",
        "timestamp": datetime.now().isoformat(),
        "total_words": total_words,
    }

    if parsed_response.actionable_data:
        start_data["actionable_data"] = parsed_response.actionable_data.dict()

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
                "type": "chunk",
                "content": current_chunk.strip(),
                "progress": round((i + 1) / total_words * 100, 1),
                "chunk_number": chunk_number,
                "timestamp": datetime.now().isoformat(),
            }

            yield {"data": json.dumps(chunk_data)}

            # Reset for next chunk
            current_chunk = ""
            word_count = 0

            # Wait to spread over 20 seconds (except for the last chunk)
            if i < len(words) - 1:
                # Add some randomness to make it feel more natural
                base_delay = 10 / 60  # ~60 chunks over 20 seconds
                random_factor = random.uniform(0.8, 1.2)  # �20% variation
                delay = base_delay * random_factor
                await asyncio.sleep(delay)

    # Send completion event with actionable data summary
    completion_data = {
        "type": "complete",
        "message": "Response stream completed",
        "total_words": total_words,
        "total_chunks": chunk_number,
        "duration": "~20 seconds",
        "timestamp": datetime.now().isoformat(),
    }

    if parsed_response.actionable_data:
        completion_data["actionable_summary"] = {
            "has_actionable_data": True,
            "channel": parsed_response.actionable_data.channel,
            "audience_count": len(parsed_response.actionable_data.audience),
            "message_preview": parsed_response.actionable_data.message[:50] + "..."
            if len(parsed_response.actionable_data.message) > 50
            else parsed_response.actionable_data.message,
        }
    else:
        completion_data["actionable_summary"] = {"has_actionable_data": False}

    yield {"data": json.dumps(completion_data)}


async def get_data_from_tools(data_sources: List[schema.DataSource]):
    """
    Process data from all valid data sources in the list.
    Only processes 'crm', 'website', or 'facebook_page' data sources.
    
    Returns:
        List[Dict[str, Any]]: A list with a single dictionary containing all data sources
        Example: [{"crm_data": {}, "website_data": {}, "facebook_data": {}}]
    """
    ALLOWED_SOURCES = {"crm", "website", "facebook_page"}
    result = {}
    sources_processed = 0
    
    if not data_sources:
        print("No data sources provided")
        return result
    
    for data_source in data_sources:
        source_name = data_source.name
        
        if source_name not in ALLOWED_SOURCES:
            print(f"Skipping unsupported data source: {source_name}")
            continue
            
        try:
            if source_name == "crm":
                print("Fetching data from CRM tool...")
                result["crm_data"] = get_crm_mock_data()
                sources_processed += 1
                
            elif source_name == "website":
                url = data_source.data.get("url", "")
                if not url:
                    print("Website URL not provided")
                    continue
                print(f"Scraping website at {url}...")
                result["website_data"] = await scrape_website(url)
                sources_processed += 1
                
            elif source_name == "facebook_page":
                url = data_source.data.get("url", "")
                if not url:
                    print("Facebook page URL not provided")
                    continue
                print(f"Fetching data from Facebook page at {url}...")
                result["facebook_data"] = get_facebook_page_mock_data(url)
                sources_processed += 1
                
        except Exception as e:
            print(f"Error processing {source_name}: {str(e)}")
            continue
    
    if sources_processed == 0:
        print("No valid data sources were processed")
        return {}  # Return empty dict if no sources processed
    
    print(f"Successfully processed {sources_processed} data source(s)")
    return result  # Return the dictionary directly
