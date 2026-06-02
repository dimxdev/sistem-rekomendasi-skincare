# QUICK TESTING GUIDE - Admin CRUD APIs

## Base URL
```
http://localhost:3000
```

## Step 1: Admin Login (Get Token)

### Request
```bash
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Response
```json
{
  "message": "Admin login berhasil!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "...",
      "username": "admin"
    }
  }
}
```

**Save the token for next requests!**

---

## Step 2: Test Public Master Data (No Auth)

### 2.1 Get All Countries
```bash
GET /countries
```

Response: 200 OK
```json
{
  "success": true,
  "data": [
    {"id": "...", "namaNegara": "Korea", "kodeNegara": "KR"},
    {"id": "...", "namaNegara": "Japan", "kodeNegara": "JP"}
  ]
}
```

### 2.2 Get All Product Types
```bash
GET /product-types
```

### 2.3 Get All Skin Types
```bash
GET /skin-types
```

### 2.4 Get All Skin Concerns
```bash
GET /concerns
```

---

## Step 3: Test Admin Country CRUD

### 3.1 Create Country
```bash
POST /admin/countries
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "namaNegara": "Malaysia",
  "kodeNegara": "MY"
}
```

Response: 201 Created
```json
{
  "success": true,
  "data": {
    "id": "61fc3358-501f-4ec0-9cad-325ecedf8ab2",
    "namaNegara": "Malaysia",
    "kodeNegara": "MY"
  }
}
```

**Save the ID for next requests!**

### 3.2 Update Country
```bash
PUT /admin/countries/61fc3358-501f-4ec0-9cad-325ecedf8ab2
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "namaNegara": "Malaysia Updated",
  "kodeNegara": "MY"
}
```

Response: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "61fc3358-501f-4ec0-9cad-325ecedf8ab2",
    "namaNegara": "Malaysia Updated",
    "kodeNegara": "MY"
  }
}
```

### 3.3 Delete Country
```bash
DELETE /admin/countries/61fc3358-501f-4ec0-9cad-325ecedf8ab2
Authorization: Bearer <your_token>
```

Response: 200 OK
```json
{
  "success": true,
  "message": "Country berhasil dihapus"
}
```

---

## Step 4: Test Admin Skin Type CRUD

### 4.1 Create Skin Type
```bash
POST /admin/skin-types
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "nama": "Normal"
}
```

### 4.2 Update Skin Type
```bash
PUT /admin/skin-types/{id}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "nama": "Normal Skin"
}
```

### 4.3 Delete Skin Type
```bash
DELETE /admin/skin-types/{id}
Authorization: Bearer <your_token>
```

---

## Step 5: Test Admin Product Type CRUD

### 5.1 Create Product Type
```bash
POST /admin/product-types
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "nama": "Mask"
}
```

### 5.2 Update Product Type
```bash
PUT /admin/product-types/{id}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "nama": "Face Mask"
}
```

### 5.3 Delete Product Type
```bash
DELETE /admin/product-types/{id}
Authorization: Bearer <your_token>
```

---

## Step 6: Test Admin Skin Concern CRUD

### 6.1 Create Skin Concern
```bash
POST /admin/concerns
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "nama": "Oiliness"
}
```

### 6.2 Update Skin Concern
```bash
PUT /admin/concerns/{id}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "nama": "Too Much Oiliness"
}
```

### 6.3 Delete Skin Concern
```bash
DELETE /admin/concerns/{id}
Authorization: Bearer <your_token>
```

---

## Step 7: Test Admin User CRUD

### 7.1 Get All Users
```bash
GET /admin/users
Authorization: Bearer <your_token>
```

Response: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "namaLengkap": "Budi Santoso",
      "email": "budi@example.com",
      "tanggalRegistrasi": "2026-05-01T10:00:00Z"
    }
  ]
}
```

### 7.2 Get User by ID
```bash
GET /admin/users/{id}
Authorization: Bearer <your_token>
```

### 7.3 Create User
```bash
POST /admin/users
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "namaLengkap": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

Response: 201 Created
```json
{
  "success": true,
  "data": {
    "id": "...",
    "namaLengkap": "Jane Doe",
    "email": "jane@example.com",
    "tanggalRegistrasi": "2026-06-02T10:00:00Z"
  }
}
```

### 7.4 Update User
```bash
PUT /admin/users/{id}
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "namaLengkap": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "newPassword123"
}
```

### 7.5 Delete User
```bash
DELETE /admin/users/{id}
Authorization: Bearer <your_token>
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Create Country
```bash
curl -X POST http://localhost:3000/admin/countries \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"namaNegara":"Vietnam","kodeNegara":"VN"}'
```

### Get All Countries
```bash
curl http://localhost:3000/countries
```

### Update Country
```bash
curl -X PUT http://localhost:3000/admin/countries/COUNTRY_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"namaNegara":"Vietnam Updated"}'
```

### Delete Country
```bash
curl -X DELETE http://localhost:3000/admin/countries/COUNTRY_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. **Create Environment Variable**
   - Variable: `base_url` = `http://localhost:3000`
   - Variable: `token` = (empty initially)

2. **Login Request**
   - Method: POST
   - URL: `{{base_url}}/admin/login`
   - Body (raw JSON):
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - After response, copy token and set in Pre-request Script:
     ```javascript
     pm.environment.set("token", pm.response.json().data.token);
     ```

3. **Admin Requests**
   - Header: `Authorization: Bearer {{token}}`
   - Header: `Content-Type: application/json`

4. **Public Requests**
   - No Authorization header needed
   - Just set `Content-Type: application/json`

---

## Common Errors & Solutions

### 401 Unauthorized
- **Cause**: Missing or invalid token
- **Solution**: Make sure you included `Authorization: Bearer <token>` header

### 403 Forbidden
- **Cause**: User is not admin
- **Solution**: Make sure you're using admin token (role must be "admin")

### 400 Bad Request
- **Cause**: Missing required fields or validation error
- **Solution**: Check the error message and provide all required fields

### 404 Not Found
- **Cause**: Resource ID doesn't exist
- **Solution**: Verify the ID is correct

### 500 Server Error
- **Cause**: Database or server error
- **Solution**: Check server console logs and database connection

---

## Data Formats

### Country
```json
{
  "namaNegara": "string (required, unique)",
  "kodeNegara": "string (optional, e.g., 'ID', 'TH')"
}
```

### Skin Type
```json
{
  "nama": "string (required, unique, e.g., 'Oily', 'Dry')"
}
```

### Product Type
```json
{
  "nama": "string (required, unique, e.g., 'Serum', 'Mask')"
}
```

### Skin Concern
```json
{
  "nama": "string (required, unique, e.g., 'Acne', 'Dryness')"
}
```

### User
```json
{
  "namaLengkap": "string (required)",
  "email": "string (required, unique, valid email format)",
  "password": "string (required for create, optional for update)"
}
```

---

## HTTP Status Codes

- **200 OK**: Request successful, resource retrieved/updated
- **201 Created**: Resource successfully created
- **400 Bad Request**: Validation error or missing required fields
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User doesn't have permission (not admin)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Useful Tips

1. **Always include `Content-Type: application/json`** header for POST/PUT requests
2. **Token expires in 7 days** - you'll need to login again after expiry
3. **IDs are UUIDs** - they're unique identifiers generated by the system
4. **Dates are in ISO 8601 format** - e.g., `2026-06-02T10:00:00Z`
5. **All responses** include `success` boolean and either `data` (success) or `message` (error)

---

Happy Testing! 🚀
