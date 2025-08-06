# Walmart IntelliCart API Documentation

## Overview
This document provides comprehensive API documentation for the Walmart IntelliCart backend services. All endpoints return JSON responses and follow RESTful conventions.

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
Currently using mock authentication. In production, implement JWT tokens or OAuth.

## Response Format
All API responses follow this structure:
\`\`\`json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "pagination": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean
  }
}
\`\`\`

## Products API

### GET /api/products
Fetch products with filtering, searching, and pagination.

**Query Parameters:**
- `search` (string): Search term for product name, description, tags
- `category` (string): Filter by product category
- `storeSection` (string): Filter by store section
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `dietary` (string): Comma-separated dietary restrictions (organic,gluten-free,vegan,vegetarian)
- `featured` (boolean): Get featured products only
- `topRated` (boolean): Get top-rated products only
- `onSale` (boolean): Get products on sale only
- `limit` (number): Number of products per page (default: 50)
- `offset` (number): Pagination offset (default: 0)
- `sortBy` (string): Sort field (name,price,rating,category)
- `sortOrder` (string): Sort order (asc,desc)

**Example Request:**
\`\`\`
GET /api/products?search=organic&category=Produce&limit=10&sortBy=price&sortOrder=asc
\`\`\`

**Example Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "prod_001",
      "name": "Organic Bananas",
      "price": 2.48,
      "originalPrice": 2.98,
      "image": "🍌",
      "category": "Produce",
      "subcategory": "Fruits",
      "brand": "Organic Valley",
      "description": "Fresh organic bananas, perfect for snacking or smoothies",
      "tags": ["organic", "fresh", "potassium", "healthy"],
      "rating": 4.5,
      "reviewCount": 1247,
      "inStock": true,
      "stockQuantity": 150,
      "storeSection": "produce",
      "barcode": "1234567890123",
      "nutritionInfo": {
        "calories": 105,
        "protein": 1.3,
        "carbs": 27,
        "fat": 0.4,
        "fiber": 3.1,
        "sodium": 1
      },
      "allergens": [],
      "organic": true,
      "glutenFree": true,
      "vegan": true,
      "vegetarian": true,
      "weight": "1 lb",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  },
  "filters": {
    "categories": ["Produce", "Dairy", "Meat", "Bakery", "Frozen", "Pantry", "Snacks", "Beverages", "Household"],
    "brands": ["Organic Valley", "Fresh Farms", "Chobani", "Perdue", "Dave's Killer Bread"]
  }
}
\`\`\`

### POST /api/products
Create a new product.

**Request Body:**
\`\`\`json
{
  "name": "New Product",
  "price": 9.99,
  "originalPrice": 12.99,
  "image": "🆕",
  "category": "Pantry",
  "subcategory": "Snacks",
  "brand": "Brand Name",
  "description": "Product description",
  "tags": ["tag1", "tag2"],
  "rating": 4.0,
  "reviewCount": 0,
  "inStock": true,
  "stockQuantity": 100,
  "storeSection": "pantry",
  "barcode": "1234567890000",
  "nutritionInfo": {
    "calories": 150,
    "protein": 5,
    "carbs": 20,
    "fat": 8,
    "fiber": 3,
    "sodium": 200
  },
  "allergens": ["nuts"],
  "organic": false,
  "glutenFree": true,
  "vegan": false,
  "vegetarian": true,
  "weight": "8 oz"
}
\`\`\`

### GET /api/products/[id]
Get a specific product by ID with recommendations.

**Example Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "product": { /* product object */ },
    "recommendations": [ /* array of related products */ ]
  }
}
\`\`\`

### PUT /api/products/[id]
Update a product.

### DELETE /api/products/[id]
Delete a product.

## Cart API

### GET /api/cart
Get user's cart(s).

**Query Parameters:**
- `userId` (string): User identifier (default: 'default')
- `type` (string): Cart type (personal,shared,both) (default: 'both')

**Example Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "personal": [
      {
        "id": "prod_001",
        "name": "Organic Bananas",
        "price": 2.48,
        "image": "🍌",
        "category": "Produce",
        "quantity": 2,
        "storeSection": "produce",
        "addedAt": "2024-01-15T10:30:00Z",
        "addedBy": "User"
      }
    ],
    "shared": [
      {
        "id": "prod_005",
        "name": "Organic Whole Milk",
        "price": 4.99,
        "image": "🥛",
        "category": "Dairy",
        "quantity": 1,
        "storeSection": "dairy",
        "addedAt": "2024-01-15T09:15:00Z",
        "addedBy": "Alex",
        "status": "pending"
      }
    ],
    "type": "both"
  },
  "updatedAt": "2024-01-15T10:30:00Z"
}
\`\`\`

### POST /api/cart
Perform cart actions (add, update, remove, clear).

**Request Body:**
\`\`\`json
{
  "userId": "default",
  "cartType": "personal",
  "action": "add",
  "item": {
    "id": "prod_001",
    "name": "Organic Bananas",
    "price": 2.48,
    "image": "🍌",
    "category": "Produce",
    "storeSection": "produce",
    "quantity": 1
  },
  "addedBy": "User"
}
\`\`\`

**Actions:**
- `add`: Add item to cart
- `update`: Update existing item
- `remove`: Remove item from cart
- `clear`: Clear entire cart

## Lists API

### GET /api/lists
Get user's shopping lists.

**Query Parameters:**
- `userId` (string): User identifier

### POST /api/lists
Create a new shopping list.

**Request Body:**
\`\`\`json
{
  "userId": "default",
  "name": "Weekly Groceries",
  "type": "personal",
  "items": [
    {
      "id": "item_001",
      "name": "Bananas",
      "category": "Produce",
      "price": 2.48,
      "image": "🍌",
      "completed": false,
      "storeSection": "produce"
    }
  ]
}
\`\`\`

### GET /api/lists/[id]
Get a specific list.

### PUT /api/lists/[id]
Update a list.

### DELETE /api/lists/[id]
Delete a list.

## Navigation API

### POST /api/navigation
Generate optimized shopping route.

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "name": "Bananas",
      "category": "Produce",
      "storeSection": "produce"
    },
    {
      "name": "Milk",
      "category": "Dairy",
      "storeSection": "dairy"
    }
  ],
  "preferences": {
    "avoidCrowds": true,
    "prioritizeSpeed": true
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "route": {
      "steps": [
        {
          "sectionId": "produce",
          "sectionName": "Produce",
          "x": 20,
          "y": 70,
          "items": ["Bananas"],
          "estimatedTime": 3,
          "crowdLevel": "low",
          "distance": 25.5,
          "instructions": "Start at entrance, then go to Produce"
        }
      ],
      "totalDistance": 125.8,
      "totalTime": 15,
      "path": [
        {"x": 50, "y": 90},
        {"x": 20, "y": 70}
      ]
    },
    "crowdLevels": {
      "produce": 1.0,
      "dairy": 1.8,
      "meat": 1.9
    },
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

### GET /api/navigation
Get navigation data.

**Query Parameters:**
- `type` (string): Data type (crowd-levels,store-layout)

## Recipes API

### GET /api/recipes
Get user's saved recipes.

### POST /api/recipes
Parse YouTube recipe or save recipe.

**Parse Recipe Request:**
\`\`\`json
{
  "userId": "default",
  "action": "parse",
  "youtubeUrl": "https://youtube.com/watch?v=example"
}
\`\`\`

**Save Recipe Request:**
\`\`\`json
{
  "userId": "default",
  "action": "save",
  "recipe": {
    "id": "recipe_001",
    "title": "Perfect Scrambled Eggs",
    "channel": "Gordon Ramsay",
    "ingredients": [
      {
        "id": "p1",
        "name": "Large Eggs",
        "quantity": "6 eggs",
        "category": "Dairy",
        "price": 2.99,
        "image": "🥚",
        "storeSection": "dairy"
      }
    ]
  }
}
\`\`\`

### GET /api/recipes/[id]
Get a specific recipe.

### PUT /api/recipes/[id]
Update a recipe.

### DELETE /api/recipes/[id]
Delete a recipe.

## Authentication API

### POST /api/auth
Handle authentication actions.

**Sign In Request:**
\`\`\`json
{
  "action": "signin",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Sign Up Request:**
\`\`\`json
{
  "action": "signup",
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Sign Out Request:**
\`\`\`json
{
  "action": "signout"
}
\`\`\`

## User Preferences API

### GET /api/user/preferences
Get user preferences.

### PUT /api/user/preferences
Update user preferences.

**Request Body:**
\`\`\`json
{
  "userId": "default",
  "preferences": {
    "householdSize": "2",
    "dietaryNeeds": ["organic", "gluten-free"],
    "healthGoals": ["weight-loss", "heart-health"],
    "shoppingDays": ["Saturday", "Sunday"],
    "shoppingFrequency": "weekly"
  }
}
\`\`\`

## Analytics API

### POST /api/analytics
Track user events.

**Request Body:**
\`\`\`json
{
  "userId": "default",
  "event": "product_added_to_cart",
  "properties": {
    "productId": "prod_001",
    "productName": "Organic Bananas",
    "category": "Produce",
    "price": 2.48,
    "cartType": "personal"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### GET /api/analytics
Get user analytics data.

**Query Parameters:**
- `userId` (string): User identifier
- `event` (string): Filter by event type
- `limit` (number): Number of events to return

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses include details:
\`\`\`json
{
  "success": false,
  "error": "Detailed error message"
}
\`\`\`

## Rate Limiting
Implement rate limiting in production:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Database Integration
To connect to a real database:

1. Replace Map storage with database queries
2. Add connection pooling
3. Implement proper error handling
4. Add data validation and sanitization
5. Set up database migrations

## Security Considerations
- Implement proper authentication (JWT/OAuth)
- Add input validation and sanitization
- Use HTTPS in production
- Implement CORS policies
- Add request logging and monitoring
- Sanitize user inputs to prevent SQL injection
- Implement proper session management
\`\`\`

I've added a comprehensive products database with 28 products across all store sections, complete API routes for all functionality, and detailed API documentation. The system now includes:

## Key Features Added:

1. **Comprehensive Product Database** (`lib/products-database.ts`):
   - 28+ products across all categories
   - Detailed product information including nutrition, allergens, ratings
   - Helper functions for searching, filtering, and recommendations

2. **Complete API Routes**:
   - `/api/products` - Product management with advanced filtering
   - `/api/cart` - Dual cart system (personal/shared)
   - `/api/lists` - Shopping list management
   - `/api/navigation` - Smart route generation
   - `/api/recipes` - YouTube recipe parsing and management
   - `/api/auth` - Authentication system
   - `/api/user/preferences` - User preference management
   - `/api/analytics` - Event tracking

3. **Backend Integration Ready**:
   - RESTful API design
   - Proper error handling
   - Pagination support
   - Query parameter filtering
   - Mock data storage (easily replaceable with real database)

4. **API Documentation** (`API_DOCUMENTATION.md`):
   - Complete endpoint documentation
   - Request/response examples
   - Error handling guidelines
   - Database integration notes

## Easy Backend Connection:

The API routes use Map storage for mock data, making it easy to replace with your preferred database:

\`\`\`typescript
// Replace this:
const PRODUCTS_STORAGE = new Map<string, any>()

// With your database connection:
import { db } from '@/lib/database'
const products = await db.products.findMany()
\`\`\`

All routes follow RESTful conventions and return consistent JSON responses, making integration with any frontend framework straightforward.
