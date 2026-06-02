import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import exampleRouter from "./modules/routes/example.route.js";
import authRoute from "./modules/routes/auth.route.js";
import favoriteRoute from "./modules/routes/favorite.route.js";
import productRoute from "./modules/routes/product.route.js";
import userRoute from "./modules/routes/user.route.js";
import adminAuthRoute from "./modules/routes/admin-auth.route.js";
import adminDashboardRoute from "./modules/routes/admin-dashboard.route.js";
import adminProductRoute from "./modules/routes/admin-product.route.js";
import masterDataRoute from "./modules/routes/master-data.route.js";
import recommendationRoute from "./modules/routes/recommendation.route.js";

const app = express();
const port = process.env.PORT;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/example", exampleRouter);
app.use("/auth", authRoute);
app.use("/favorites", favoriteRoute);
app.use("/products", productRoute);

// PERBAIKAN: Ubah awalan menjadi "/" agar endpoint /admin/users dan /users/me
// dari file user.route.js dapat terbaca dengan tepat
app.use("/", userRoute);

app.use("/admin", adminAuthRoute);
app.use("/admin/dashboard", adminDashboardRoute);
app.use("/admin/products", adminProductRoute);
app.use("/", masterDataRoute);
app.use("/recommendations", recommendationRoute);

app.listen(port, () => {
  console.log(`server connected at http://localhost:${port}`);
});
