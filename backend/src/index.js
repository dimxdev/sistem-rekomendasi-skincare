import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import exampleRouter from "./modules/routes/example.route.js";
import authRoute from "./modules/routes/auth.route.js";
import favoriteRoute from "./modules/routes/favorite.route.js";
import productRoute from "./modules/routes/product.route.js";
import userRoute from "./modules/routes/user.route.js";
import adminAuthRoute from "./modules/routes/admin-auth.route.js";
import masterDataRoute from "./modules/routes/master-data.route.js";
import productTypeRoute from "./modules/routes/product-type.route.js";
import skinTypeRoute from "./modules/routes/skin-type.route.js";
import skinConcernRoute from "./modules/routes/skin-concern.route.js";
import countryRoute from "./modules/routes/country.route.js";
import adminUserRoute from "./modules/routes/admin-user.route.js";

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/example", exampleRouter);
app.use("/auth", authRoute);
app.use("/favorites", favoriteRoute);
app.use("/products", productRoute);
app.use("/admin", adminAuthRoute);
app.use("/", userRoute);
app.use("/", masterDataRoute);
app.use("/", productTypeRoute);
app.use("/", skinTypeRoute);
app.use("/", skinConcernRoute);
app.use("/", countryRoute);
app.use("/", adminUserRoute);

app.listen(port, () => {
  console.log(`server connected at http://localhost:${port}`);
});
