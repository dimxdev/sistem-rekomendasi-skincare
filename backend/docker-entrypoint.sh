#!/bin/sh
set -e

echo "Menjalankan migrasi database..."
npx prisma migrate deploy

# Jalankan seed hanya jika SEED=true (mis. saat pertama kali setup)
if [ "$SEED" = "true" ]; then
  echo "Menjalankan seed database..."
  npx prisma db seed || true
fi

echo "Menjalankan server..."
exec node src/index.js
