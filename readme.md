# 🌸 Sistem Rekomendasi Skincare

Sistem rekomendasi skincare berbasis web menggunakan metode filtering berdasarkan jenis kulit dan masalah kulit pengguna. Project ini menggunakan ReactJS untuk frontend, ExpressJS untuk backend, Prisma ORM, dan PostgreSQL sebagai database. ✨

---

# 🛠️ Tech Stack

## 🎨 Frontend

* ReactJS
* React Router DOM
* Axios
* Vite

## ⚙️ Backend

* ExpressJS
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Bcrypt

---

# 🚀 Features

## 👤 User

* ✅ Register akun
* ✅ Login akun
* ✅ Melihat daftar produk skincare
* ✅ Search produk
* ✅ Filter produk berdasarkan:

  * 🌍 Negara
  * 🧴 Jenis produk
  * 💧 Jenis kulit
  * ✨ Masalah kulit
* ✅ Melihat detail produk
* ✅ Menambahkan favorit
* ✅ Menghapus favorit
* ✅ Melihat daftar favorit
* ✅ Redirect ke toko online

## 👨‍💼 Admin

* ✅ Login admin
* ✅ CRUD produk
* ✅ CRUD kategori negara
* ✅ CRUD pengguna

---

# ⚙️ Backend Setup

## 1️⃣ Masuk ke folder backend

```bash
cd backend
```

---

## 2️⃣ Install dependency

```bash
npm install
```

---

## 3️⃣ Rename file environment

Ubah file:

```bash
.env.example
```

menjadi:

```bash
.env
```

Lalu isi sesuai konfigurasi PostgreSQL masing-masing 🗄️

Contoh:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skincare_db"

JWT_SECRET="secret_jwt_kalian"

PORT=3000
```

---

## 4️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

## 5️⃣ Jalankan migration database

```bash
npx prisma migrate dev
```

---

## 6️⃣ Jalankan seed database

```bash
npx prisma db seed
```

Seed akan mengisi:

* 👨‍💼 Admin dummy
* 👤 User dummy
* 🧴 Produk skincare
* 🌍 Kategori negara
* 💧 Jenis kulit
* ✨ Masalah kulit
* 🔗 Relasi produk

---

## 7️⃣ Menjalankan backend

```bash
npm run dev
```

Server berjalan di:

```bash
http://localhost:3000
```

---

# 🎨 Frontend Setup

## 1️⃣ Masuk ke folder frontend

```bash
cd frontend
```

---

## 2️⃣ Install dependency

```bash
npm install
```

---

## 3️⃣ Rename file environment

Ubah file:

```bash
.env.example
```

menjadi:

```bash
.env
```

Lalu isi:

```env
VITE_API_URL=http://localhost:3000
```

---

## 4️⃣ Jalankan frontend

```bash
npm run dev
```

Frontend berjalan di:

```bash
http://localhost:5173
```

---

#