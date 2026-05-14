# E-Commerce Backend
Node.js + Express + MongoDB — Production-ready REST API

---

## 📁 Folder Structure
```
ecommerce-backend/
├── server.js              ← Entry point
├── .env.example           ← Environment variables template
├── config/
│   └── db.js              ← MongoDB connection
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Category.js        ← Category + Cart model দুটোই এখানে
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── cartController.js
├── middleware/
│   ├── auth.js            ← JWT + NextAuth token verify
│   └── errorHandler.js
└── routes/
    ├── authRoutes.js
    ├── productRoutes.js
    ├── orderRoutes.js
    ├── userRoutes.js
    ├── categoryRoutes.js
    └── cartRoutes.js
```

---

## 🚀 Setup করার পদ্ধতি

### ১. Dependencies install করুন
```bash
npm install
```

### ২. Environment file তৈরি করুন
```bash
cp .env.example .env
```
`.env` file open করে নিজের values দিন।

### ৩. Server চালু করুন
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## 🔗 API Endpoints

### Auth
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /api/auth/register | Public | নতুন user তৈরি |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Private | নিজের profile |
| PUT | /api/auth/profile | Private | Profile update |
| PUT | /api/auth/change-password | Private | Password change |
| POST | /api/auth/oauth-sync | Internal | NextAuth user sync |

### Products
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/products | Public | সব products (filter/search/page) |
| GET | /api/products/:id | Public | একটি product |
| POST | /api/products | Admin | Product তৈরি |
| PUT | /api/products/:id | Admin | Product update |
| DELETE | /api/products/:id | Admin | Product delete |
| POST | /api/products/:id/reviews | Private | Review দেওয়া |

### Orders
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /api/orders | Private | Order তৈরি |
| GET | /api/orders/my | Private | নিজের orders |
| GET | /api/orders/:id | Private | একটি order |
| GET | /api/orders | Admin | সব orders |
| PUT | /api/orders/:id/status | Admin | Status update |

### Cart
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/cart | Private | Cart দেখা |
| POST | /api/cart | Private | Item add/update |
| DELETE | /api/cart/:productId | Private | Item remove |
| DELETE | /api/cart | Private | Cart clear |

---

## 🔒 NextAuth Integration

`NEXTJS_INTEGRATION.js` ফাইলটি দেখুন। এতে আছে:
1. NextAuth config (`app/api/auth/[...nextauth]/route.js`)
2. API call helper (`lib/api.js`)
3. Component এ use করার example

### .env (Next.js side)
```env
NEXTAUTH_SECRET=same_as_backend_NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:5000
```

---

## 🛡️ Features
- JWT authentication
- NextAuth token verification
- Role-based access (user/admin)
- Product search, filter, pagination
- Stock management (order time এ auto-decrease)
- Free shipping above ৳1000
- Soft delete (data থাকে, শুধু hide হয়)
- Rate limiting (15min এ 100 requests)
- Global error handling
