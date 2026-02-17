## Inventory Management Backend (Node.js, Express, MongoDB)

This backend provides a secure, JWT-based API for managing suppliers, raw materials, and stock-in/stock-out transactions for an inventory system.

### Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcrypt

### Getting Started

- **1. Install dependencies**

```bash
cd Backend
npm install
```

- **2. Create a `.env` file in `Backend`**

```bash
MONGO_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

- **3. Run the server**

```bash
npm run dev   # with nodemon
```

Server will start on `http://localhost:5000`.

### Main Routes

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout` (requires `Authorization: Bearer <token>`)

- **Suppliers** (all require JWT)
  - `GET /api/suppliers`
  - `POST /api/suppliers`
  - `GET /api/suppliers/:id`
  - `PUT /api/suppliers/:id`
  - `DELETE /api/suppliers/:id`

- **Materials** (all require JWT)
  - `GET /api/materials`
  - `POST /api/materials`
  - `GET /api/materials/:id`
  - `PUT /api/materials/:id`
  - `DELETE /api/materials/:id`

- **Stock** (all require JWT)
  - `POST /api/stock/in` – record stock-in, update material `currentStock` up
  - `POST /api/stock/out` – record stock-out, update material `currentStock` down
  - `GET /api/stock` – list transactions with optional filters

### Sample Payloads

- **Register**

```json
{
  "username": "admin1",
  "email": "admin1@example.com",
  "password": "StrongPass123!",
  "role": "admin"
}
```

- **Login**

```json
{
  "usernameOrEmail": "admin1",
  "password": "StrongPass123!"
}
```

- **Create Supplier**

```json
{
  "companyName": "ABC Supplies",
  "contactName": "John Doe",
  "email": "contact@abc.com",
  "phone": "+1-555-1234",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

- **Create Material**

```json
{
  "name": "Steel Rod",
  "description": "High quality steel rod",
  "unit": "kg",
  "unitPrice": 10.5,
  "currentStock": 0
}
```

- **Stock In**

```json
{
  "materialId": "<materialObjectId>",
  "supplierId": "<supplierObjectId>",
  "quantity": 100,
  "unitPrice": 10.5,
  "reference": "PO-2026-001",
  "notes": "Initial stock"
}
```

- **Stock Out**

```json
{
  "materialId": "<materialObjectId>",
  "quantity": 10,
  "reference": "SO-2026-010",
  "notes": "Used in production"
}
```

