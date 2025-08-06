# Setup Guide for Walmart IntelliCart

This guide will help you set up the frontend and backend connection for the Walmart IntelliCart application.

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Google Gemini API key

## Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
MONGODB_URI=mongodb://localhost:27017/intellicart
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

The backend should now be running on `http://localhost:5000`

## Step 2: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd walmart-intellicart
```

2. Install dependencies:
```bash
npm install
# or if using pnpm
pnpm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
# or if using pnpm
pnpm dev
```

The frontend should now be running on `http://localhost:3000`

## Step 3: Testing the Connection

1. Open your browser and go to `http://localhost:3000`
2. You should be redirected to the login page
3. Create a new account or sign in with existing credentials
4. After successful authentication, you'll be redirected to the dashboard
5. Navigate to the "Recipes" section to test the recipe matching feature

## Features Now Available

### Authentication
- ✅ User registration with email, password, and name
- ✅ User login with email and password
- ✅ JWT token-based authentication
- ✅ Protected routes that redirect to login if not authenticated
- ✅ Automatic token validation and user session management

### Recipe Matching
- ✅ YouTube recipe URL input
- ✅ AI-powered ingredient extraction using Google Gemini
- ✅ Inventory matching to show what ingredients you have
- ✅ Visual feedback showing available vs needed ingredients

### Protected Routes
- ✅ `/dashboard` - Main application dashboard
- ✅ `/recipes` - Recipe matching feature
- ✅ `/cart` - Shopping cart (protected)
- ✅ `/lists` - Shopping lists (protected)
- ✅ `/store` - Store navigation (protected)
- ✅ `/profile` - User profile (protected)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Recipe Matching
- `POST /api/recipie/check-ingredients` - Analyze YouTube recipe ingredients

## Troubleshooting

### Backend Issues
- Make sure MongoDB is running and accessible
- Check that all environment variables are set correctly
- Verify the JWT_SECRET is a strong secret key
- Ensure the Gemini API key is valid

### Frontend Issues
- Check that the `NEXT_PUBLIC_API_URL` is pointing to the correct backend URL
- Clear browser cache and localStorage if authentication issues persist
- Check browser console for any CORS errors

### CORS Issues
The backend is configured with CORS to allow requests from the frontend. If you encounter CORS issues, make sure:
- Backend is running on port 5000
- Frontend is running on port 3000
- The CORS configuration in `backend/app.js` is correct

## Next Steps

1. **Add more features**: Implement shopping lists, cart functionality, and store navigation
2. **Enhance security**: Add rate limiting, input validation, and error handling
3. **Improve UI/UX**: Add loading states, better error messages, and responsive design
4. **Add tests**: Implement unit tests and integration tests
5. **Deploy**: Set up production deployment for both frontend and backend

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/intellicart
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Development Commands

### Backend
```bash
cd backend
npm install
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
cd walmart-intellicart
npm install
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
``` 