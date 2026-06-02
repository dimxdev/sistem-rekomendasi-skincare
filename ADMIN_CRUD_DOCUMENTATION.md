# Admin CRUD API Documentation

## Overview
Dokumentasi lengkap untuk semua Admin CRUD endpoints yang telah diimplementasikan untuk sistem rekomendasi skincare.

---

## 1. ADMIN COUNTRY CRUD

### Files Created:
- `repositories/country.repository.js`
- `services/country.service.js`
- `controllers/country.controller.js`
- `routes/country.route.js`

### Endpoints:

#### GET - Dapatkan Semua Negara
```
GET /countries
```
- **Access**: Public
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "namaNegara": "Indonesia",
      "kodeNegara": "ID"
    }
  ]
}
```

#### POST - Tambah Country (Admin Only)
```
POST /admin/countries
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body**:
```json
{
  "namaNegara": "Indonesia",
  "kodeNegara": "ID"
}
```
- **Response**: 201 Created
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "namaNegara": "Indonesia",
    "kodeNegara": "ID"
  }
}
```

#### PUT - Update Country (Admin Only)
```
PUT /admin/countries/:id
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body**:
```json
{
  "namaNegara": "Indonesia Updated",
  "kodeNegara": "ID"
}
```

#### DELETE - Hapus Country (Admin Only)
```
DELETE /admin/countries/:id
Authorization: Bearer <token>
```
- **Response**:
```json
{
  "success": true,
  "message": "Country berhasil dihapus"
}
```

---

## 2. ADMIN SKIN TYPE CRUD

### Files:
- `repositories/skin-type.repository.js` ✓
- `services/kin-type.service.js` ✓
- `controllers/skin-type.controller.js` ✓
- `routes/skin-type.route.js` ✓

### Endpoints:

#### GET - Dapatkan Semua Skin Type
```
GET /skin-types
```
- **Access**: Public

#### POST - Tambah Skin Type (Admin Only)
```
POST /admin/skin-types
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body**:
```json
{
  "nama": "Oily"
}
```

#### PUT - Update Skin Type (Admin Only)
```
PUT /admin/skin-types/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### DELETE - Hapus Skin Type (Admin Only)
```
DELETE /admin/skin-types/:id
Authorization: Bearer <token>
```

---

## 3. ADMIN PRODUCT TYPE CRUD

### Files:
- `repositories/product-type.repository.js` ✓
- `services/product-type.service.js` ✓
- `controllers/product-type.controller.js` ✓
- `routes/product-type.route.js` ✓

### Endpoints:

#### GET - Dapatkan Semua Product Type
```
GET /product-types
```
- **Access**: Public

#### POST - Tambah Product Type (Admin Only)
```
POST /admin/product-types
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body**:
```json
{
  "nama": "Serum"
}
```

#### PUT - Update Product Type (Admin Only)
```
PUT /admin/product-types/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### DELETE - Hapus Product Type (Admin Only)
```
DELETE /admin/product-types/:id
Authorization: Bearer <token>
```

---

## 4. ADMIN SKIN CONCERN CRUD

### Files:
- `repositories/skin-concern.repository.js` ✓
- `services/skin-concern.service.js` ✓
- `controllers/skin-concern.controller.js` ✓
- `routes/skin-concern.route.js` ✓

### Endpoints:

#### GET - Dapatkan Semua Skin Concern
```
GET /concerns
```
- **Access**: Public

#### POST - Tambah Skin Concern (Admin Only)
```
POST /admin/concerns
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body**:
```json
{
  "nama": "Acne"
}
```

#### PUT - Update Skin Concern (Admin Only)
```
PUT /admin/concerns/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### DELETE - Hapus Skin Concern (Admin Only)
```
DELETE /admin/concerns/:id
Authorization: Bearer <token>
```

---

## 5. ADMIN USER CRUD

### Files Created:
- `repositories/admin-user.repository.js`
- `services/admin-user.service.js`
- `controllers/admin-user.controller.js`
- `routes/admin-user.route.js`

### Endpoints:

#### GET - Dapatkan Semua Users (Admin Only)
```
GET /admin/users
Authorization: Bearer <token>
```
- **Response**: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "tanggalRegistrasi": "2025-06-02T10:00:00Z"
    }
  ]
}
```

#### GET - Dapatkan User by ID (Admin Only)
```
GET /admin/users/:id
Authorization: Bearer <token>
```
- **Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "namaLengkap": "John Doe",
    "email": "john@example.com",
    "tanggalRegistrasi": "2025-06-02T10:00:00Z"
  }
}
```

#### POST - Buat User Baru (Admin Only)
```
POST /admin/users
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body**:
```json
{
  "namaLengkap": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response**: 201 Created

#### PUT - Update User (Admin Only)
```
PUT /admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json
```
- **Body** (semua field opsional):
```json
{
  "namaLengkap": "Jane Doe",
  "email": "jane@example.com",
  "password": "newPassword123"
}
```

#### DELETE - Hapus User (Admin Only)
```
DELETE /admin/users/:id
Authorization: Bearer <token>
```
- **Response**: 200 OK
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

---

## Authentication

Semua endpoint admin memerlukan:
1. **Authorization Header** dengan format: `Bearer <token>`
2. **Admin Role** - Token harus memiliki role "admin"
3. **Valid JWT Token** - Token harus valid dan tidak expired

### Cara Mendapatkan Admin Token:
```
POST /admin/login
Content-Type: application/json

{
  "username": "admin_username",
  "password": "admin_password"
}
```

---

## Error Handling

### Response Format untuk Error:
```json
{
  "success": false,
  "message": "Deskripsi error"
}
```

### Status Codes:
- **200**: OK
- **201**: Created
- **400**: Bad Request (validasi error)
- **401**: Unauthorized (tidak login/token tidak valid)
- **403**: Forbidden (bukan admin)
- **404**: Not Found
- **500**: Server Error

---

## Validasi Data

### Country:
- `namaNegara` (required): String, harus unique
- `kodeNegara` (optional): String

### Skin Type:
- `nama` (required): String, harus unique

### Product Type:
- `nama` (required): String, harus unique

### Skin Concern:
- `nama` (required): String, harus unique

### User:
- `namaLengkap` (required): String
- `email` (required): String, harus unique, valid format email
- `password` (required saat create): String, minimal 6 karakter

---

## Catatan Penting

1. **Password Hashing**: Semua password di-hash menggunakan bcrypt sebelum disimpan ke database
2. **Unique Constraints**: Nama untuk master data (Country, Skin Type, Product Type, Skin Concern) dan email untuk User harus unique
3. **Admin Only**: Semua operasi CREATE, UPDATE, DELETE hanya bisa dilakukan oleh admin
4. **Public Read**: Operasi GET (read) untuk master data (Country, Skin Type, Product Type, Skin Concern) dapat diakses oleh public
5. **User Management**: User management hanya bisa dilakukan oleh admin, tidak ada akses public

---

## Testing dengan cURL

### Create Country:
```bash
curl -X POST http://localhost:5000/admin/countries \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"namaNegara":"Indonesia","kodeNegara":"ID"}'
```

### Get All Countries:
```bash
curl http://localhost:5000/countries
```

### Update Country:
```bash
curl -X PUT http://localhost:5000/admin/countries/country-id \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"namaNegara":"Indonesia Jaya"}'
```

### Delete Country:
```bash
curl -X DELETE http://localhost:5000/admin/countries/country-id \
  -H "Authorization: Bearer your_token"
```

---

## Struktur Folder yang Dibuat

```
backend/
├── src/
│   ├── modules/
│   │   ├── controllers/
│   │   │   ├── country.controller.js (NEW)
│   │   │   ├── skin-type.controller.js ✓
│   │   │   ├── product-type.controller.js ✓
│   │   │   ├── skin-concern.controller.js ✓
│   │   │   └── admin-user.controller.js (NEW)
│   │   ├── services/
│   │   │   ├── country.service.js (NEW)
│   │   │   ├── kin-type.service.js ✓
│   │   │   ├── product-type.service.js ✓
│   │   │   ├── skin-concern.service.js ✓
│   │   │   └── admin-user.service.js (NEW)
│   │   ├── repositories/
│   │   │   ├── country.repository.js (NEW)
│   │   │   ├── skin-type.repository.js ✓
│   │   │   ├── product-type.repository.js ✓
│   │   │   ├── skin-concern.repository.js ✓
│   │   │   └── admin-user.repository.js (NEW)
│   │   └── routes/
│   │       ├── country.route.js (NEW)
│   │       ├── skin-type.route.js ✓
│   │       ├── product-type.route.js ✓
│   │       ├── skin-concern.route.js ✓
│   │       └── admin-user.route.js (NEW)
│   └── index.js (UPDATED)
```

---

## Dependencies

Pastikan dependencies di `package.json` sudah terinstall:
```json
{
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "prisma": "6.19.3"
  }
}
```

---

Generated: 2025-06-02
Status: ✅ Complete
