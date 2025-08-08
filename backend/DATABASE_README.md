# Trading Dashboard Database Setup

This document explains the database structure and API endpoints for the Trading Dashboard application.

## Database Tables

### 1. Users Table
Stores user account information and authentication data.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    hashed_password VARCHAR(255) NOT NULL,    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
```

### 2. Stocks Table
Contains information about available stocks for trading.

```sql
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    sector VARCHAR(100),
    exchange VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Primary key
- `symbol`: Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
- `name`: Full company name
- `description`: Detailed company description (optional, max 1000 chars)
- `sector`: Business sector (optional)
- `exchange`: Stock exchange (e.g., 'NASDAQ', 'NYSE')
- `currency`: Trading currency (default: 'USD')

### 3. Positions Table
Tracks user's stock positions (owned shares).

```sql
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stock_id INTEGER REFERENCES stocks(id),
    quantity FLOAT NOT NULL,
    purchase_price FLOAT NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Watchlist Table
Stores stocks that users are monitoring.

```sql
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stock_id INTEGER REFERENCES stocks(id),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(500)
);
```

## Database Setup

### 1. Initialize Database
Run the database initialization script to create tables and add sample data:

```bash
cd backend
python init_database.py
```

This will:
- Create all database tables
- Add sample stocks (AAPL, GOOGL, MSFT, TSLA, etc.)
- Display table summary

### 2. Environment Configuration
Ensure your `.env` file contains the correct database URL:

```env
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## API Endpoints

### Authentication Endpoints (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `PUT /auth/me` - Update user profile

### Stock Endpoints (`/stocks`)

- `GET /stocks/` - Get all stocks
- `GET /stocks/{stock_id}` - Get stock by ID
- `GET /stocks/symbol/{symbol}` - Get stock by symbol
- `GET /stocks/search/{query}` - Search stocks
- `POST /stocks/` - Create new stock (admin)
- `PUT /stocks/{stock_id}` - Update stock (admin)
- `DELETE /stocks/{stock_id}` - Delete stock (admin)

### Position Endpoints (`/positions`)

- `GET /positions/` - Get user's positions
- `GET /positions/portfolio` - Get portfolio summary
- `GET /positions/{position_id}` - Get specific position
- `POST /positions/` - Create new position (buy stock)
- `PUT /positions/{position_id}` - Update position
- `DELETE /positions/{position_id}` - Delete position (sell all)
- `POST /positions/{position_id}/sell` - Sell specific quantity

### Watchlist Endpoints (`/watchlist`)

- `GET /watchlist/` - Get user's watchlist
- `GET /watchlist/summary` - Get watchlist summary
- `GET /watchlist/{watchlist_id}` - Get specific watchlist item
- `POST /watchlist/` - Add stock to watchlist
- `POST /watchlist/symbol/{symbol}` - Add stock by symbol
- `PUT /watchlist/{watchlist_id}` - Update watchlist item
- `DELETE /watchlist/{watchlist_id}` - Remove from watchlist
- `DELETE /watchlist/symbol/{symbol}` - Remove by symbol

## Sample API Usage

### 1. Register and Login
```bash
# Register new user
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Get Stocks
```bash
# Get all stocks
curl "http://localhost:8000/stocks/"

# Get specific stock
curl "http://localhost:8000/stocks/symbol/AAPL"

# Search stocks
curl "http://localhost:8000/stocks/search/apple"
```

### 3. Manage Positions
```bash
# Buy stock (create position)
curl -X POST "http://localhost:8000/positions/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stock_id": 1,
    "quantity": 10,
    "purchase_price": 150.00
  }'

# Get portfolio
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/positions/portfolio"
```

### 4. Manage Watchlist
```bash
# Add to watchlist
curl -X POST "http://localhost:8000/watchlist/symbol/TSLA" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Watching for dip"}'

# Get watchlist
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/watchlist/"
```

## Database Relationships

```
Users (1) ----< Positions >---- (1) Stocks
  |                                  ^
  |                                  |
  +----------< Watchlist >-----------+
```

- One user can have multiple positions
- One user can have multiple watchlist items
- One stock can be in multiple positions
- One stock can be in multiple watchlists
- Each position belongs to one user and one stock
- Each watchlist item belongs to one user and one stock

## Data Models

### User Model
- `id`: Primary key
- `email`: Unique email address
- `username`: Unique username
- `full_name`: Optional full name
- `hashed_password`: Encrypted password
- `is_active`: Account status
- `is_verified`: Email verification status
- `created_at`: Account creation timestamp
- `last_login`: Last login timestamp

### Stock Model
- `id`: Primary key
- `symbol`: Stock ticker symbol (e.g., AAPL)
- `name`: Company name
- `description`: Detailed company description (optional, max 1000 chars)
- `sector`: Business sector
- `exchange`: Stock exchange (NASDAQ, NYSE)
- `currency`: Trading currency
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### Position Model
- `id`: Primary key
- `user_id`: Foreign key to users table
- `stock_id`: Foreign key to stocks table
- `quantity`: Number of shares owned
- `purchase_price`: Average purchase price per share
- `purchase_date`: Date of purchase
- `total_value`: Calculated property (quantity × purchase_price)

### Watchlist Model
- `id`: Primary key
- `user_id`: Foreign key to users table
- `stock_id`: Foreign key to stocks table
- `date_added`: When stock was added to watchlist
- `notes`: Optional notes about the stock

## Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   python main.py
   ```

2. **Initialize database (first time only):**
   ```bash
   python init_database.py
   ```

3. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

4. **Test API health:**
   ```bash
   curl http://localhost:8000/health
   ```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes requiring authentication
- Input validation with Pydantic schemas
- SQL injection protection with SQLAlchemy ORM
- CORS configuration for frontend integration

## Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 404: Not Found (resource doesn't exist)
- 422: Unprocessable Entity (validation errors)
- 500: Internal Server Error (unexpected errors)

All errors return JSON responses with descriptive messages.
