# Trading Dashboard

A modern, full-stack trading simulation platform built with React and FastAPI, featuring real-time stock data, portfolio management, and comprehensive trading tools.

**Live Demo**: [Deployed on Render, Click here to test it](https://dashboard-frontend-n88x.onrender.com)


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

## Features


### Real-Time Trading Interface
- Live stock quotes and price updates  
- Interactive charts with multiple timeframes (1D, 1W, 1Y, 5Y)  
- Professional trading interface with buy/sell functionality  
- Real-time portfolio performance tracking

  You need first to create an account or login if you already have an account.
  
<img width="1920" height="921" alt="signup" src="https://github.com/user-attachments/assets/bd39ca31-5b82-454e-816f-725712e314ca" />

<img width="1920" height="919" alt="signin" src="https://github.com/user-attachments/assets/c50d0ca8-4c87-4cdc-af2e-475bcb57d988" />


<br><br>
Then You will view the real-time trading interface.
So the topbar contains the stocks and this section is the same for all users, and the sideblock on the right contains the positions and the watchlist of the current user.

  <img width="1920" height="923" alt="dashboard" src="https://github.com/user-attachments/assets/e1e46b30-cc42-4bf5-bebc-729dd1e9216e" />
  Initially a user doesn't have any positions or watchlist
  <img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/2cc50e6e-e165-4d2f-ade5-acb1abefbfe3" />


<br><br>
  You can add a stock to a wachlist by clicking on "Add to watchlist", and if you want to remove a stock from watchlist you can click on "Remove From watchlist".

<img width="1920" height="925" alt="dashboard-stock" src="https://github.com/user-attachments/assets/537a453b-7e93-4d59-b8b1-0f42d8f98232" />

 <br><br>
 Or you can Buy shares from watchlist and it would move to the positions section.
<img width="1920" height="925" alt="5" src="https://github.com/user-attachments/assets/41b52c60-8729-48be-8eea-5f8351c9db12" />

  <br><br>
  In positions section, you can buy more shares, or sell few or all shares.
<img width="1920" height="926" alt="6" src="https://github.com/user-attachments/assets/5c8736de-181a-4384-81d9-6e1ecf328ed3" />

 Of course you can't sell more shares than the ones that you have.
<img width="1920" height="925" alt="7" src="https://github.com/user-attachments/assets/510d986b-332f-4fcd-affe-bf15e01bf098" />
<img width="1920" height="915" alt="8" src="https://github.com/user-attachments/assets/4967a8ef-a910-4e00-9af5-b9b504f4e2c3" />

   <br><br>


You can view all your trade history in this section and know your overall gain or loss
<img width="1920" height="917" alt="9" src="https://github.com/user-attachments/assets/91535eec-a178-4c86-a3d7-d6241180140a" />
If there is no history for the user, then nothing would be displayed
<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/3d103ad7-baec-4239-bcc7-f714e2d2dc7c" />


  And this last section is to view the trade guide. This is static content.
<img width="1920" height="918" alt="10" src="https://github.com/user-attachments/assets/5498f3be-555a-482f-9eae-6c16c7f80183" />


### Portfolio Management
- Complete position tracking with profit/loss calculations  
- Portfolio value and performance metrics  
- Trade history with detailed transaction records  
- Watchlist management for stock monitoring  

### Modern UIUX
- Responsive design with mobile support  
- Dark/Light theme switching
<img width="1920" height="919" alt="11" src="https://github.com/user-attachments/assets/d917f51a-b974-4726-934a-d9a45abd311d" />
- Real-time data visualization with charts
  

### Authentication and Security
- JWT-based authentication system
- JWT Authentication Implementation
- Backend JWT Setup:
- Library: Using python-jose for JWT handling
- Token Expiration: 30 minutes by default (or configurable via environment variable with ACCESS_TOKEN_EXPIRE_MINUTES)
- Security: HTTPBearer scheme for token transmission
 






## Tech Stack

### Frontend
- React 19.1.0 with TypeScript  
- Redux Toolkit for state management  
- MUI X Charts for data visualization  
- Bootstrap 5 for responsive design  
- React Router for navigation  

### Backend
- FastAPI with Python 3.8+  (the one that I am using is 3.9.7)
- PostgreSQL database
- SQLAlchemy ORM  
- JWT authentication  
- bcrypt for password hashing  

### External APIs
- Finnhub for real-time stock data  

## Prerequisites
- Node (recommended v20 or higher) I am using v22.12.0
- Python (3.8 or higher)  I am using 3.9.7
- npm or yarn  
- Git  

## Quick Start

### Clone the Repository
```bash
git clone [https://github.com/zohraharibi/dashboard](https://github.com/zohraharibi/dashboard)
cd dashboard
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
DATABASE_URL=postgresql://zohra:KrSLEJJSwNUFdIvpNDOzD5ydLtWtCKOk@dpg-d2affku3jp1c73ajd680-a.oregon-postgres.render.com/trading_g1gu
ACCESS_TOKEN_EXPIRE_MINUTES=30
FINNHUB_API_KEY=your-finnhub-api-key
PORT = 8000
```
You should also add in main.py the localhost url, because only the render url is added
```main.py
allow_origins=[
        "https://dashboard-frontend-n88x.onrender.com",
        "http://localhost:5173",
    ],
```
and replace uvicorn.run in start_server.py by this
```start_server.py
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info",
            access_log=True
        )
```
#### Database Setup
I have used a remote database in postgresql as mentioned in the environment configurations. The link was provided by render.

#### Start Backend Server
```bash
python start_server.py
```

### Frontend Setup

#### Install Dependencies
In a new terminal access the frontend folder
```bash
cd frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

#### Start Frontend Development Server
```bash
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173  
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
<img width="947" height="786" alt="image" src="https://github.com/user-attachments/assets/31913a52-5c4b-4217-ae68-9fff926b0c4c" />


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

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT secret key | ✅ |
| `FINNHUB_API_KEY` | Finnhub API key | ✅ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration | ❌ |

## API Documentation

The Trading Dashboard provides a comprehensive REST API with the following endpoints, please note that not all of these apis are used currently. But this project will get improved and use all of them and even add more apis to make it richer! No admin dashboard is available for now

### Authentication Endpoints (`/auth`)
- `POST /auth/register` - Register a new user account
- `POST /auth/login` - User login and JWT token generation
- `GET /auth/me` - Get current authenticated user information
- `PUT /auth/me` - Update user profile details

### Stock Management (`/stocks`)
- `GET /stocks/` - Retrieve all available stocks
- `GET /stocks/{stock_id}` - Get specific stock by ID
- `GET /stocks/symbol/{symbol}` - Get stock information by symbol (e.g., AAPL)
- `GET /stocks/search/{query}` - Search stocks by name or symbol
- `POST /stocks/` - Create new stock entry (admin only)
- `PUT /stocks/{stock_id}` - Update stock information (admin only)
- `DELETE /stocks/{stock_id}` - Remove stock from system (admin only)

### Portfolio & Positions (`/positions`)
- `GET /positions/` - Get user's current stock positions
- `GET /positions/portfolio` - Get complete portfolio summary with totals
- `GET /positions/{position_id}` - Get specific position details
- `POST /positions/` - Buy stock (create new position)
- `PUT /positions/{position_id}` - Update existing position
- `DELETE /positions/{position_id}` - Sell entire position
- `POST /positions/{position_id}/sell` - Sell specific quantity from position

### Watchlist Management (`/watchlist`)
- `GET /watchlist/` - Get user's watchlist items
- `GET /watchlist/summary` - Get watchlist summary with statistics
- `GET /watchlist/{watchlist_id}` - Get specific watchlist item
- `POST /watchlist/` - Add stock to watchlist by stock ID
- `POST /watchlist/symbol/{symbol}` - Add stock to watchlist by symbol
- `PUT /watchlist/{watchlist_id}` - Update watchlist item notes
- `DELETE /watchlist/{watchlist_id}` - Remove item from watchlist
- `DELETE /watchlist/symbol/{symbol}` - Remove stock from watchlist by symbol

### Trade History (`/trade-history`)
- `GET /trade-history/` - Get complete trading history for user

### System Endpoints
- `GET /` - API root with basic information and available endpoints
- `GET /health` - Health check endpoint for monitoring
- `GET /docs` - Interactive API documentation (Swagger UI)

### API Features
- **Authentication**: JWT-based authentication for secure access
- **Authorization**: User-specific data access and admin-only operations
- **Real-time Data**: Integration with Finnhub for live stock prices
- **Documentation**: Auto-generated OpenAPI documentation

### Example Usage
<img width="1920" height="1041" alt="get_all_watchlists" src="https://github.com/user-attachments/assets/52cea056-a4b7-4ff4-9b98-af9c0e90640f" />

```bash
# Get user's portfolio
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8000/positions/portfolio"

# Add stock to watchlist
curl -X POST "http://localhost:8000/watchlist/symbol/TSLA" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Monitoring for entry point"}'

# Buy shares
curl -X POST "http://localhost:8000/positions/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stock_id": 1, "quantity": 10, "purchase_price": 150.00}'
```


<div align="center">
  <strong>Built with ❤️ For Fortaegis Technologies B.V</strong>
</div>

