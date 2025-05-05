# E-commerce Store Assignment

A full-stack e-commerce implementation with cart management, checkout process, and discount code system.

## Assignment Implementation

### Backend Features

#### Core Functionality

- 🛒 Shopping Cart Management
  - Add items to cart
  - Update item quantities
  - Remove items
  - Real-time total calculation
- 💳 Checkout System
  - Process orders
  - Validate discount codes
  - Apply 10% discount when valid
- 🎟️ Discount Code System
  - Automatic generation every nth order
  - One-time use per code
  - 10% discount on entire order
- 📊 Admin Features
  - Generate discount codes
  - View store statistics
    - Total orders
    - Total purchase amount
    - List of discount codes
    - Total discount amount

#### Technical Implementation

- **Server**: Express.js with TypeScript
- **Storage**: In-memory store
- **API Structure**:
  - RESTful endpoints
  - JSON response format
  - Proper HTTP methods
- **Development Tools**:
  - TypeScript for type safety
  - Jest for testing
  - Hot reloading with ts-node-dev

### API Endpoints

#### Cart Operations

- `GET /api/cart` - Get cart contents
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart

#### Checkout Process

- `POST /api/checkout` - Process order with optional discount code
- `GET /api/checkout/discount` - Get available discount code

#### Admin Operations

- `POST /api/checkout/admin/discount` - Generate new discount code
- `GET /api/checkout/admin/stats` - Get store statistics

### Getting Started

1. Install dependencies:

```bash
cd backend
npm install
```

2. Start development server:

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default.

### Testing

Run the test suite:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

## Frontend Development

🚧 **In Progress** 🚧

We're currently developing a React frontend:
