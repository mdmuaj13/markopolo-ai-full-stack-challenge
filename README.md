# AI Campaign Application

A full-stack web application built with Next.js and FastAPI for managing AI campaigns.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Prerequisites**
   - Docker
   - Docker Compose

2. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marko-challenge
   ```

3. **Start with Docker**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Or run in background
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs (Swagger UI): http://localhost:8000/docs

5. **Stop the application**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

1. **Prerequisites**
   - Node.js (v20 or later)
   - Python (3.11 or later)
   - Redis (for background tasks)
   - npm or pnpm

2. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marko-challenge
   ```

3. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs (Swagger UI): http://localhost:8000/docs

## 🏗️ Project Structure

```
marko-challenge/
├── client/                    # Next.js frontend
│   ├── app/                   # App router and pages
│   ├── public/                # Static files
│   ├── Dockerfile             # Client Docker config
│   └── package.json           # Frontend dependencies
│
├── server/                    # FastAPI backend
│   ├── src/                   # Source code
│   │   ├── main.py           # Main FastAPI application
│   │   ├── celery_app.py     # Celery configuration
│   │   └── api/              # API routes
│   ├── Dockerfile             # Server Docker config
│   └── requirements.txt       # Python dependencies
│
├── docker-compose.yml         # Docker orchestration
├── .dockerignore              # Docker ignore rules
└── .gitignore                 # Git ignore rules
```

## 🛠️ Development

### Docker Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f client
docker-compose logs -f server

# Rebuild specific service
docker-compose up --build client
docker-compose up --build server

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Local Development (Without Docker)

#### Frontend Development

```bash
cd client
npm install    # Install dependencies
npm run dev    # Start development server
```

#### Backend Development

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Start Redis (required for background tasks)
redis-server

# Start FastAPI server
uvicorn src.main:app --reload

# Start Celery worker (in separate terminal)
celery -A src.celery_app.celery_app worker --loglevel=info
```

## 🌐 API Documentation

Once the backend is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name]
