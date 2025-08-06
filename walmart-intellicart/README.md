# Walmart IntelliCart - Smart Grocery Shopping Assistant

An AI-powered grocery shopping application with smart recommendations, household sync, and in-store navigation.

## Features

- 🔐 **Authentication System**: Secure login/signup with JWT tokens
- 🛒 **Smart Shopping Lists**: AI-powered list management
- 📱 **Recipe Matching**: Match YouTube recipes with your kitchen inventory
- 🏠 **Household Sync**: Share lists with family members
- 🧭 **In-Store Navigation**: Navigate efficiently through the store
- 🤖 **AI Assistant**: Get personalized shopping recommendations

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Context** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Gemini AI** for recipe analysis

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd walmart-intellicart
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Recipe Matching
- `POST /api/recipie/check-ingredients` - Analyze YouTube recipe ingredients

## Protected Routes

The following routes require authentication:
- `/dashboard` - Main application dashboard
- `/cart` - Shopping cart
- `/lists` - Shopping lists
- `/recipes` - Recipe matching
- `/store` - Store navigation
- `/profile` - User profile

## Authentication Flow

1. Users can sign up with email, password, and name
2. Users can sign in with email and password
3. JWT tokens are stored in localStorage and cookies
4. Protected routes automatically redirect to login if not authenticated
5. Middleware handles route protection at the Next.js level

## Recipe Matching

The recipe matching feature:
1. Accepts YouTube recipe URLs
2. Uses Google Gemini AI to extract ingredients
3. Compares ingredients with user's kitchen inventory
4. Shows which ingredients are available and which need to be purchased

## Development

### Backend Development
- The backend uses Express with MongoDB
- Authentication is handled with JWT tokens
- Password hashing is done with bcryptjs
- Recipe analysis uses Google Gemini AI

### Frontend Development
- Built with Next.js 14 and TypeScript
- Uses React Context for authentication state
- Protected routes with middleware
- Responsive design with Tailwind CSS

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GEMINI_API_KEY`: Google Gemini API key
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 