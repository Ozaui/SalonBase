# SalonBase Backend API

A comprehensive REST API for salon management system built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete CRUD operations for users with admin/user roles
- **Service Management**: Manage salon services with categories and pricing
- **Appointment System**: Full appointment booking and management system
- **Data Validation**: Comprehensive input validation using express-validator
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Pagination**: Built-in pagination for all list endpoints
- **Statistics**: Dashboard statistics for admins

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: morgan

## Installation

1. Clone the repository
2. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create environment file:

   ```bash
   cp env.example .env
   ```

5. Configure environment variables in `.env`:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/salonbase
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

6. Start MongoDB (make sure MongoDB is installed and running)

7. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users (Admin Only)

- `GET /api/users` - Get all users with pagination
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

### Services

- `GET /api/services` - Get all services (Protected)
- `GET /api/services/:id` - Get single service (Protected)
- `POST /api/services` - Create service (Admin Only)
- `PUT /api/services/:id` - Update service (Admin Only)
- `DELETE /api/services/:id` - Delete service (Admin Only)
- `GET /api/services/stats` - Get service statistics (Admin Only)

### Appointments

- `GET /api/appointments` - Get all appointments (Admin Only)
- `GET /api/appointments/user/:userId` - Get user appointments (Protected)
- `GET /api/appointments/:id` - Get single appointment (Protected)
- `POST /api/appointments` - Create appointment (Protected)
- `PUT /api/appointments/:id` - Update appointment (Protected)
- `DELETE /api/appointments/:id` - Delete appointment (Protected)
- `GET /api/appointments/stats` - Get appointment statistics (Admin Only)

## Data Models

### User

```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'admin' | 'user',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Service

```javascript
{
  name: String,
  description: String,
  duration: Number (minutes),
  price: Number,
  isActive: Boolean,
  category: 'hair' | 'nails' | 'facial' | 'massage' | 'other',
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment

```javascript
{
  userId: ObjectId (ref: User),
  userName: String,
  userPhone: String,
  service: String,
  serviceId: ObjectId (ref: Service),
  date: Date,
  time: String (HH:MM),
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  notes: String,
  duration: Number (minutes),
  price: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All errors follow a consistent format:

```javascript
{
  success: false,
  message: "Error description",
  error?: "Additional error details"
}
```

## Validation

Input validation is handled using express-validator with custom error messages for better user experience.

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS origins
5. Use environment variables for all sensitive data
6. Consider using PM2 or similar process manager

## API Response Format

All successful responses follow this format:

```javascript
{
  success: true,
  data: {
    // Response data
  },
  message?: "Success message"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
