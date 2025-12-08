# API Testing Guide

This guide helps you manually test all API endpoints in the application.

## Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Server should be running at `http://localhost:3000`

2. **Get a user ID** (you'll need this for DELETE operations):
   - Run the seed script: `npx tsx scripts/seedSupabaseUsers.ts`
   - Or check Supabase dashboard for user IDs
   - Or use GET `/api/users` to list users

## Testing Tools

You can use any of these:
- **cURL** (command line) - Examples below
- **Postman** - Import the requests
- **Browser** - For GET requests only
- **Thunder Client** (VS Code extension)
- **REST Client** (VS Code extension)

---

## 1. User Management Endpoints

### 1.1 GET `/api/users` - List All Users

**cURL:**
```bash
curl -X GET http://localhost:3000/api/users
```

**With sorting:**
```bash
curl -X GET "http://localhost:3000/api/users?sort=-created_date"
```

**Expected Response:**
```json
[
  {
    "id": "uuid-here",
    "email": "admin@example.com",
    "full_name": "Admin User",
    "role": "admin",
    "created_date": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

**Browser:** Just open `http://localhost:3000/api/users` in your browser

---

### 1.2 POST `/api/users` - Create User

**cURL:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "role": "user",
    "full_name": "Test User"
  }'
```

**Create user with phone only:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+855123456789",
    "password": "test123456",
    "role": "user",
    "full_name": "Phone User"
  }'
```

**Create admin user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "admin123",
    "role": "admin",
    "full_name": "New Admin"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "full_name": "Test User",
  "role": "user",
  "password": "test123456",
  "created_date": "2024-01-01T00:00:00.000Z"
}
```

**Error Cases:**
- Missing email/phone: `{"error": "Email or phone is required"}`
- Invalid role: `{"error": "Invalid role"}`

---

### 1.3 DELETE `/api/users/[id]` - Delete User

**cURL:**
```bash
# Replace USER_ID with actual UUID from GET /api/users
curl -X DELETE http://localhost:3000/api/users/USER_ID
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000
```

**Expected Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Failed to delete user"
}
```

---

## 2. Product Management Endpoints

### 2.1 GET `/api/products` - List All Products

**cURL:**
```bash
curl -X GET http://localhost:3000/api/products
```

**Expected Response:**
```json
[
  {
    "id": "uuid-here",
    "name": "Product Name",
    "brand": "Brand Name",
    "category": "សម្លៀកបំពាក់កីឡាបុរស",
    "cover_image": "https://example.com/image.jpg",
    "catalog_images": ["url1", "url2"],
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"],
    "color_count": 10,
    "stock_status": "in_stock",
    "restock_date": null,
    "notes": "Some notes",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

**Browser:** Open `http://localhost:3000/api/products`

---

### 2.2 POST `/api/products` - Create Product

**cURL:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "brand": "Test Brand",
    "category": "សម្លៀកបំពាក់កីឡាបុរស",
    "cover_image": "https://example.com/cover.jpg",
    "catalog_images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Red", "Blue", "Green"],
    "color_count": 5,
    "stock_status": "in_stock",
    "restock_date": null,
    "notes": "Test product notes",
    "is_active": true
  }'
```

**Minimal product (only name required):**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minimal Product"
  }'
```

**Product with color_count but no colors array:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product with Many Colors",
    "category": "សម្លៀកបំពាក់កីឡាបុរស",
    "color_count": 15,
    "stock_status": "in_stock"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "name": "Test Product",
  "brand": "Test Brand",
  "category": "សម្លៀកបំពាក់កីឡាបុរស",
  "cover_image": "https://example.com/cover.jpg",
  "catalog_images": ["https://example.com/img1.jpg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Blue", "Green"],
  "color_count": 5,
  "stock_status": "in_stock",
  "restock_date": null,
  "notes": "Test product notes",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Cases:**
- Missing name: `{"error": "Name is required"}`

**Valid stock_status values:**
- `"in_stock"`
- `"low_stock"`
- `"out_of_stock"`
- `"restocking"`

**Valid categories (Khmer):**
- `"សម្លៀកបំពាក់កីឡាបុរស"` (Men Sportswear)
- `"សម្លៀកបំពាក់កីឡាស្ត្រី"` (Women Sportswear)
- `"អាវបាល់ទាត់"` (Football Jersey)
- `"អាវបាល់បោះ"` (Basketball Jersey)
- `"កាបូបស្ពាយ"` (Backpacks)
- `"កាបូប"` (Bags)
- `"សម្លៀកបំពាក់ម៉ូតូ"` (Motorbike Clothes)
- `"សំលៀកបំពាក់ហែលទឹកស្ត្រី"` (Women Swimsuit)
- `"ស្រោមជើង"` (Socks)
- `"ខោក្នុងបុរស"` (Men Underpant)

---

### 2.3 PUT `/api/products/[id]` - Update Product

**cURL:**
```bash
# Replace PRODUCT_ID with actual UUID from GET /api/products
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    "stock_status": "low_stock",
    "color_count": 8
  }'
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "brand": "Updated Brand",
    "stock_status": "out_of_stock",
    "restock_date": "2024-12-31",
    "notes": "Updated notes"
  }'
```

**Expected Response:**
```json
{
  "id": "uuid-here",
  "name": "Updated Product Name",
  "stock_status": "low_stock",
  "color_count": 8,
  "updated_at": "2024-01-01T12:00:00.000Z",
  ...
}
```

**Note:** You can update any field(s). Only provided fields will be updated.

---

### 2.4 DELETE `/api/products/[id]` - Delete Product

**cURL:**
```bash
# Replace PRODUCT_ID with actual UUID from GET /api/products
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000
```

**Expected Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Failed to delete product"
}
```

---

## Testing Workflow Example

### Complete Test Sequence:

1. **List users:**
   ```bash
   curl http://localhost:3000/api/users
   ```
   Save a user ID for deletion test.

2. **Create a test user:**
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123","role":"user","full_name":"Test User"}'
   ```
   Save the returned user ID.

3. **List products:**
   ```bash
   curl http://localhost:3000/api/products
   ```
   Save a product ID for update/delete tests.

4. **Create a test product:**
   ```bash
   curl -X POST http://localhost:3000/api/products \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Product","category":"សម្លៀកបំពាក់កីឡាបុរស","stock_status":"in_stock"}'
   ```
   Save the returned product ID.

5. **Update the product:**
   ```bash
   curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
     -H "Content-Type: application/json" \
     -d '{"name":"Updated Product","stock_status":"low_stock"}'
   ```

6. **Delete the test product:**
   ```bash
   curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID
   ```

7. **Delete the test user:**
   ```bash
   curl -X DELETE http://localhost:3000/api/users/USER_ID
   ```

---

## Using Postman

1. **Create a new Collection:** "MeyMeySport API"

2. **Add requests:**
   - Method: GET, URL: `http://localhost:3000/api/users`
   - Method: POST, URL: `http://localhost:3000/api/users`, Body (raw JSON)
   - Method: DELETE, URL: `http://localhost:3000/api/users/{{userId}}` (use variables)
   - Method: GET, URL: `http://localhost:3000/api/products`
   - Method: POST, URL: `http://localhost:3000/api/products`, Body (raw JSON)
   - Method: PUT, URL: `http://localhost:3000/api/products/{{productId}}`, Body (raw JSON)
   - Method: DELETE, URL: `http://localhost:3000/api/products/{{productId}}`

3. **Set Collection Variables:**
   - `baseUrl`: `http://localhost:3000`
   - `userId`: (set after creating a user)
   - `productId`: (set after creating a product)

---

## Using Browser DevTools

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Use `fetch()` API:

```javascript
// GET users
fetch('http://localhost:3000/api/users')
  .then(r => r.json())
  .then(console.log);

// POST product
fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Browser Test Product',
    category: 'សម្លៀកបំពាក់កីឡាបុរស',
    stock_status: 'in_stock'
  })
})
  .then(r => r.json())
  .then(console.log);
```

---

## Common Issues

1. **"Failed to fetch"** - Make sure dev server is running (`npm run dev`)

2. **500 Internal Server Error** - Check server console for detailed error messages

3. **"Name is required"** - Make sure `name` field is included in POST body

4. **Invalid UUID** - Make sure you're using correct UUID format for DELETE/PUT operations

5. **Connection refused** - Verify server is running on port 3000

---

## Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST - though Next.js returns 200)
- `400` - Bad Request (validation errors)
- `404` - Not Found (invalid endpoint)
- `500` - Internal Server Error (server-side errors)

---

## Notes

- All endpoints currently use service role key (no authentication required)
- In production, you should add authentication middleware
- User passwords are only returned when creating new users
- Product `color_count` is optional and can be different from `colors` array length
- All timestamps are in ISO 8601 format (UTC)

