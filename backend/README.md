# Food Order Backend

Backend API for the Food Order application built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```
MONGODB_URI=mongodb://localhost:27017/food-order
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3000
FRONTEND_URL=http://localhost:5173
```

3. Make sure MongoDB is running on your system.

4. Seed the database with meals data:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Meals
- `GET /api/meals` - Get all meals

### Orders
- `POST /api/orders` - Create a new order (requires authentication)
- `GET /api/orders` - Get user's orders (requires authentication)

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

