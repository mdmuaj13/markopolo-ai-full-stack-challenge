# AI Campaign Application

A full-stack web application built with Next.js and FastAPI for managing AI campaigns.

## 🚀 Quick Start

1. **Prerequisites**

   - Node.js (v16 or later)
   - Python (3.8 or later)
   - pnpm (recommended) or npm

2. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd marko-challenge
   ```

3. **Start the application**

   You can start both client and server together or individually:

   #### Start both client and server (recommended for development)

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
│   ├── package.json           # Frontend dependencies
│   └── ...
│
├── server/                    # FastAPI backend
│   ├── src/                   # Source code
│   │   └── main.py           # Main FastAPI application
│   └── requirements.txt       # Python dependencies
│
├── .gitignore                 # Git ignore rules
└── start.sh                  # Startup script
```

## 🛠️ Development

### Frontend Development

```bash
cd client
pnpm install    # Install dependencies
pnpm dev       # Start development server
```

### Backend Development

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

## 🌐 API Documentation

Once the backend is running, you can access the interactive API documentation at:

- Swagger UI: http://localhost:8000/docs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Your Name]
