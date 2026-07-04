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

# 🐳 Menjalankan dengan Docker (Rekomendasi)

Cara paling mudah — **tidak perlu install Node.js maupun PostgreSQL**. Cukup punya [Docker Desktop](https://www.docker.com/products/docker-desktop/). Semua service (database, backend, frontend) otomatis berjalan dalam container.

## 1️⃣ Siapkan file environment

Salin file `.env.example` di **root project** menjadi `.env`:

```bash
cp .env.example .env
```

Isinya sudah siap pakai. Untuk run **pertama kali**, set `SEED=true` agar data awal (admin, produk, dll) langsung terisi:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=skincare_db
JWT_SECRET=supersecretjwt
SEED=true
VITE_API_URL=http://localhost:3000
```

> 💡 Cukup urus **satu file `.env` di root** ini saja. File `.env` di dalam `backend/` dan `frontend/` **tidak perlu disentuh** — itu hanya untuk mode dev non-Docker.

---

## 2️⃣ Build & jalankan semua container

```bash
docker compose up --build
```

Perintah ini otomatis:

* 🗄️ Menyalakan PostgreSQL
* ⚙️ Menjalankan migrasi Prisma
* 🌱 Mengisi seed database (jika `SEED=true`)
* 🎨 Build & serve frontend

---

## 3️⃣ Akses aplikasi

* 🎨 Frontend → [http://localhost:8080](http://localhost:8080)
* ⚙️ Backend → [http://localhost:3000](http://localhost:3000)

Login admin hasil seed → **username:** `admin` — **password:** `admin123`

---

## 4️⃣ Setelah run pertama

Kembalikan `SEED=false` di `.env` agar seed tidak dijalankan ulang. Untuk pemakaian sehari-hari:

```bash
docker compose up -d      # nyalakan (background)
docker compose down       # matikan (data database TETAP aman)
docker compose logs -f    # lihat log realtime
```

> ⚠️ Gunakan `docker compose down -v` **hanya** jika ingin mereset database dari nol (menghapus semua data). Ini juga wajib dilakukan jika mengubah `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`, karena kredensial hanya dibuat saat volume database pertama kali dibuat.

---

# ⚙️ Backend Setup (Manual / Tanpa Docker)

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

# 🎨 Frontend Setup (Manual / Tanpa Docker)

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