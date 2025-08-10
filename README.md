# Trading Dashboard

A modern, full-stack trading simulation platform built with React and FastAPI, featuring real-time stock data, portfolio management, and comprehensive trading tools.

**Live Demo**: [Deployed on Render](https://your-app-name.onrender.com)

![Status](https://img.shields.io/badge/Status-Active-brightgreen)  
![React](https://img.shields.io/badge/React-18.x-blue)  
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)  
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)  

## Table of Contents

1. [Features](#features)  
   - [Real-Time Trading Interface](#real-time-trading-interface)  
   - [Portfolio Management](#portfolio-management)  
   - [Modern UIUX](#modern-uiux)  
   - [Authentication and Security](#authentication-and-security)  
2. [Tech Stack](#tech-stack)  
   - [Frontend](#frontend)  
   - [Backend](#backend)  
   - [External APIs](#external-apis)  
3. [Prerequisites](#prerequisites)  
4. [Quick Start](#quick-start)  
   - [Clone the Repository](#clone-the-repository)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)  
   - [Access the Application](#access-the-application)  
5. [Project Structure](#project-structure)  
6. [Database Schema](#database-schema)  
   - [Core Tables](#core-tables)  
   - [Relationships](#relationships)  
7. [Configuration](#configuration)  
   - [API Keys Required](#api-keys-required)  
8. [Testing](#testing)  
9. [Deployment](#deployment)  
10. [Contributing](#contributing)  
11. [License](#license)  

## Features

### Real-Time Trading Interface
- Live stock quotes and price updates  
- Interactive charts with multiple timeframes (1D, 1W, 1Y, 5Y)  
- Professional trading interface with buy/sell functionality  
- Real-time portfolio performance tracking  

### Portfolio Management
- Complete position tracking with profit/loss calculations  
- Portfolio value and performance metrics  
- Trade history with detailed transaction records  
- Watchlist management for stock monitoring  

### Modern UIUX
- Responsive design with mobile support  
- Dark/Light theme switching  
- Professional trading dashboard layout  
- Real-time data visualization with charts  

### Authentication and Security
- JWT-based authentication system  
- Secure user registration and login  
- Protected routes and API endpoints  
- Session management with token validation  

## Tech Stack

### Frontend
- React 18 with TypeScript  
- Redux Toolkit for state management  
- MUI X Charts for data visualization  
- Bootstrap 5 for responsive design  
- React Router for navigation  

### Backend
- FastAPI with Python 3.8+  
- PostgreSQL database  
- SQLAlchemy ORM  
- JWT authentication  
- bcrypt for password hashing  

### External APIs
- Finnhub for real-time stock data  
- Alpha Vantage for additional financial data  

## Prerequisites
- Node.js (v16 or higher)  
- Python (3.8 or higher)  
- PostgreSQL (12 or higher)  
- npm or yarn  
- Git  

## Quick Start

### Clone the Repository
```bash
git clone https://github.com/your-username/trading-dashboard.git
cd trading-dashboard
```

### Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/trading_db
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FINNHUB_API_KEY=your-finnhub-api-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
```

#### Database Setup
```bash
createdb trading_db
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
```

#### Start Backend Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

#### Start Frontend Development Server
```bash
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs  

## Project Structure

```
trading-dashboard/
├── frontend/                
│   ├── src/
│   │   ├── components/      
│   │   ├── store/           
│   │   ├── App.tsx
│   │   └── App.css
│   ├── public/
│   └── package.json
├── backend/                 
│   ├── models.py            
│   ├── auth.py              
│   ├── database.py          
│   ├── main.py              
│   ├── requirements.txt     
└── README.md
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stocks Table
```sql
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Positions Table
```sql
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Watchlist Table
```sql
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stock_id)
);
```

#### Trade History Table
```sql
CREATE TABLE trade_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
    trade_type VARCHAR(4) CHECK (trade_type IN ('BUY', 'SELL')),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- Users → Positions (One-to-Many)  
- Users → Watchlist (One-to-Many)  
- Users → Trade History (One-to-Many)  
- Stocks → Positions (One-to-Many)  
- Stocks → Watchlist (One-to-Many)  
- Stocks → Trade History (One-to-Many)  

## Configuration

### API Keys Required
1. **Finnhub API Key** — [Sign up here](https://finnhub.io/)  
2. **Alpha Vantage API Key** — [Sign up here](https://www.alphavantage.co/support/#api-key)  

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT secret key | ✅ |
| `FINNHUB_API_KEY` | Finnhub API key | ✅ |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | ✅ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration | ❌ |

## Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker
```bash
docker-compose up --build
```

## Contributing
1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit changes (`git commit -m 'Add amazing feature'`)  
4. Push (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.
