import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger/swagger-output.json";

import { veriifyUser } from "./middlewares/authMiddleware";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

import categoryRoutes from "./routes/categoryRoutes";
import subCategoryRoutes from "./routes/subcategoryRoutes";
import userRoutes from "./routes/userRoutes";
import prodcutCategoryRoutes from "./routes/productCategoryRoutes";
import businessRoutes from "./routes/businessRoutes";
import productRoutes from "./routes/productRoutes";
import bestOfferRoutes from "./routes/bestofferRoutes";
import bestchoiceRoutes from "./routes/bestChoiceRoutes";
import todaySpecialRoutes from "./routes/todaySpecailRoutes";
import orderRoutes from "./routes/orderRoutes";
import addressRoutes from "./routes/addressRoutes";
import imageRoutes from "./routes/imageRoutes";
import cartRoutes from "./routes/cartRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import searchRoutes from "./routes/searchRoutes";

app.use(reqlogger);
app.use("/user", userRoutes);
app.use("/categories", veriifyUser, categoryRoutes);
app.use("/subcategories", veriifyUser, subCategoryRoutes);
app.use("/productCategories", veriifyUser, prodcutCategoryRoutes);
app.use("/business", veriifyUser, businessRoutes);
app.use("/products", veriifyUser, productRoutes);
app.use("/bestoffers", veriifyUser, bestOfferRoutes);
app.use("/bestchoice", veriifyUser, bestchoiceRoutes);
app.use("/todayspecials", veriifyUser, todaySpecialRoutes);
app.use("/orders", veriifyUser, orderRoutes);
app.use("/address", veriifyUser, addressRoutes);
app.use("/cart", veriifyUser, cartRoutes);
app.use("/images", imageRoutes);
app.use("/review", veriifyUser, reviewRoutes);
app.use("/search", veriifyUser, searchRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, { explorer: true })
);

export default app;

function reqlogger(req: Request, res: Response, next: Function) {
  console.log(`${req.method} ${req.url}`);
  next();
}
