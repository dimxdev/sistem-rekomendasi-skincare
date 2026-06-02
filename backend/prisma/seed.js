import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // =========================
  // ADMIN
  // =========================

  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.admin.create({
    data: {
      username: "admin",
      passwordHash: adminPassword,
    },
  });

  // =========================
  // USERS
  // =========================

  const userPassword = await bcrypt.hash("user123", 10);

  const user1 = await prisma.user.create({
    data: {
      namaLengkap: "Budi Santoso",
      email: "budi@example.com",
      passwordHash: userPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      namaLengkap: "Siti Nurhaliza",
      email: "siti@example.com",
      passwordHash: userPassword,
    },
  });

  // =========================
  // COUNTRIES
  // =========================

  const korea = await prisma.country.create({
    data: {
      namaNegara: "Korea",
      kodeNegara: "KR",
    },
  });

  const japan = await prisma.country.create({
    data: {
      namaNegara: "Japan",
      kodeNegara: "JP",
    },
  });

  const indonesia = await prisma.country.create({
    data: {
      namaNegara: "Indonesia",
      kodeNegara: "ID",
    },
  });

  // =========================
  // PRODUCT TYPES
  // =========================

  const cleanser = await prisma.productType.create({
    data: { nama: "Cleanser" },
  });

  const toner = await prisma.productType.create({
    data: { nama: "Toner" },
  });

  const serum = await prisma.productType.create({
    data: { nama: "Serum" },
  });

  const moisturizer = await prisma.productType.create({
    data: { nama: "Moisturizer" },
  });

  const sunscreen = await prisma.productType.create({
    data: { nama: "Sunscreen" },
  });

  // =========================
  // SKIN TYPES
  // =========================

  const oily = await prisma.skinType.create({
    data: { nama: "Oily" },
  });

  const dry = await prisma.skinType.create({
    data: { nama: "Dry" },
  });

  const combination = await prisma.skinType.create({
    data: { nama: "Combination" },
  });

  const sensitive = await prisma.skinType.create({
    data: { nama: "Sensitive" },
  });

  // =========================
  // SKIN CONCERNS
  // =========================

  const acne = await prisma.skinConcern.create({
    data: { nama: "Acne" },
  });

  const dullness = await prisma.skinConcern.create({
    data: { nama: "Dullness" },
  });

  const dryness = await prisma.skinConcern.create({
    data: { nama: "Dryness" },
  });

  const redness = await prisma.skinConcern.create({
    data: { nama: "Redness" },
  });

  const darkSpot = await prisma.skinConcern.create({
    data: { nama: "Dark Spot" },
  });

  // =========================
  // PRODUCTS
  // =========================

  const cosrx = await prisma.product.create({
    data: {
      namaProduk: "COSRX Salicylic Acid Daily Gentle Cleanser",
      brand: "COSRX",
      manfaatUtama: "Membersihkan wajah dan membantu mengurangi jerawat",
      tokoOnlineUrl: "https://shopee.co.id",
      imageUrl:
        "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/96/MTA-182223555/br-m036969-16338_cosrx-salicylic-acid-daily-gentle-cleanser-150ml-50ml-original-cosrx-facial-wash_full01-b73f3e77.jpg",

      countryId: korea.id,
      productTypeId: cleanser.id,
    },
  });

  const hadaLabo = await prisma.product.create({
    data: {
      namaProduk: "Hada Labo Gokujyun Ultimate Moisturizing Lotion",
      brand: "Hada Labo",
      manfaatUtama: "Melembapkan dan menjaga hidrasi kulit",
      tokoOnlineUrl: "https://tokopedia.com",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsnkPgGBKWQi3nfgdMtUcBpwqlCV3d8CnMmQ&s",

      countryId: japan.id,
      productTypeId: toner.id,
    },
  });

  const skintific = await prisma.product.create({
    data: {
      namaProduk: "SKINTIFIC 5X Ceramide Barrier Repair Moisture Gel",
      brand: "SKINTIFIC",
      manfaatUtama: "Memperbaiki skin barrier dan melembapkan",
      tokoOnlineUrl: "https://shopee.co.id",
      imageUrl:
        "https://www.beautyhaul.com/assets/uploads/products/thumbs/800x800/5X_Ceramide_Barrier_Moisture_Gel_30gr-522.jpg",

      countryId: indonesia.id,
      productTypeId: moisturizer.id,
    },
  });

  // =========================
  // PRODUCT SKIN TYPES
  // =========================

  await prisma.productSkinType.createMany({
    data: [
      {
        productId: cosrx.id,
        skinTypeId: oily.id,
      },
      {
        productId: cosrx.id,
        skinTypeId: combination.id,
      },
      {
        productId: hadaLabo.id,
        skinTypeId: dry.id,
      },
      {
        productId: hadaLabo.id,
        skinTypeId: sensitive.id,
      },
      {
        productId: skintific.id,
        skinTypeId: sensitive.id,
      },
      {
        productId: skintific.id,
        skinTypeId: dry.id,
      },
    ],
  });

  // =========================
  // PRODUCT CONCERNS
  // =========================

  await prisma.productConcern.createMany({
    data: [
      {
        productId: cosrx.id,
        concernId: acne.id,
      },
      {
        productId: cosrx.id,
        concernId: redness.id,
      },
      {
        productId: hadaLabo.id,
        concernId: dryness.id,
      },
      {
        productId: hadaLabo.id,
        concernId: dullness.id,
      },
      {
        productId: skintific.id,
        concernId: redness.id,
      },
      {
        productId: skintific.id,
        concernId: dryness.id,
      },
    ],
  });

  // =========================
  // FAVORITES
  // =========================

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      productId: cosrx.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      productId: hadaLabo.id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
