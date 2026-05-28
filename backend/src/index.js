import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import exampleRouter from "./modules/routes/example.route.js";
import authRoute from "./modules/routes/auth.route.js";
import favoriteRoute from "./modules/routes/favorite.route.js";
import productRoute from "./modules/routes/product.route.js";
import userRoute from "./modules/routes/user.route.js";
import adminAuthRoute from "./modules/routes/admin-auth.route.js";

const app = express();
const port = process.env.PORT;

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/example", exampleRouter);
app.use("/auth", authRoute);
app.use("/favorites", favoriteRoute);
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/admin", adminAuthRoute);

app.listen(port, () => {
  console.log(`server connected at http://localhost:${port}`);
});
