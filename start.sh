#!/bin/bash

# Array to store background process IDs
declare -a PIDS=()

# Function to kill background processes on script exit
cleanup() {
    echo -e "\n🛑 Stopping all processes..."
    # Kill all processes in the PIDS array
    for pid in "${PIDS[@]}"; do
        if kill -0 $pid 2>/dev/null; then
            echo "Stopping process $pid..."
            # Send SIGTERM first for graceful shutdown
            kill -SIGTERM $pid 2>/dev/null
            # Wait a bit for graceful shutdown
            sleep 2
            # Force kill if still running
            if kill -0 $pid 2>/dev/null; then
                echo "Force killing process $pid..."
                kill -9 $pid 2>/dev/null
            fi
        fi
    done
    # Kill all child processes of this script
    pkill -P $$
    exit 0
}

# Set up trap for various signals
trap cleanup SIGINT SIGTERM EXIT

# Start AI Campaign Application
echo "🚀 Starting AI Campaign Application..."

# Function to start the FastAPI server
start_server() {
    echo "📡 Starting FastAPI server..."
    cd server
    if [ ! -d "env" ]; then
        echo "Creating virtual environment..."
        python3 -m venv env
    fi
    source env/bin/activate
    pip install -r requirements.txt
    uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 &
    PIDS+=($!)
    cd ..
    echo "✅ FastAPI server started (PID: ${PIDS[-1]})"
}

# Function to start the Next.js client
start_client() {
    echo "🖥️  Starting Next.js client..."
    cd client
    pnpm install
    pnpm run dev &
    PIDS+=($!)
    cd ..
    echo "✅ Next.js client started (PID: ${PIDS[-1]})"
}

# Start server and client
start_server
# Give server a moment to start
sleep 3
start_client

echo -e "\n✅ Applications are running:"
echo "📡 Server: http://localhost:8000"
echo "🖥️  Client: http://localhost:3000"
echo -e "\nPress Ctrl+C to stop both applications"

# Wait for all background processes and check their status
for pid in "${PIDS[@]}"; do
    if wait $pid; then
        echo "Process $pid exited successfully"
    else
        echo "Process $pid failed with status $?"
    fi
done
