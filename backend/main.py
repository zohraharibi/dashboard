from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from database import create_tables, test_connection
from routes.auth import router as auth_router
from routes.stocks import router as stocks_router
from routes.positions import router as positions_router
from routes.watchlist import router as watchlist_router
from routes.trade_history import router as trade_history_router
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Trading Dashboard API",
    description="Backend API for the Trading Dashboard application with PostgreSQL",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - Allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and test connection on startup."""
    logger.info("🚀 Starting Trading Dashboard API...")
    
    # Test database connection
    if test_connection():
        logger.info("✅ Database connection established")
        
        # Create database tables
        create_tables()
        logger.info("✅ Database tables initialized")
    else:
        logger.error("❌ Failed to connect to database")
        raise Exception("Database connection failed")
    
    logger.info("🎉 Trading Dashboard API started successfully!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("👋 Shutting down Trading Dashboard API...")

# Include routers
app.include_router(auth_router)
app.include_router(stocks_router)
app.include_router(positions_router)
app.include_router(watchlist_router)
app.include_router(trade_history_router)

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint with basic information."""
    return {
        "message": "Trading Dashboard API",
        "version": "1.0.0",
        "status": "running",
        "database": "PostgreSQL",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "auth": "/auth",
            "stocks": "/stocks",
            "positions": "/positions",
            "watchlist": "/watchlist"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint to verify API status."""
    try:
        # Test database connection
        db_status = test_connection()
        
        return {
            "status": "healthy" if db_status else "unhealthy",
            "message": "API is running properly" if db_status else "Database connection issues",
            "database": "connected" if db_status else "disconnected",
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "message": f"Health check failed: {str(e)}",
            "database": "error",
            "version": "1.0.0"
        }

# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "message": "Validation error",
            "success": False,
            "errors": exc.errors(),
            "detail": "Please check your input data"
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    logger.error(f"HTTP error: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.detail,
            "success": False,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions."""
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "success": False,
            "detail": "An unexpected error occurred. Please try again later."
        }
    )

# Development server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
