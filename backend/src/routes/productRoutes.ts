import express, { Request, Response } from "express";
import productControllers from "../controllers/productControllers";
import upload from "../utils/uploadMiddleware";
import { ProductType } from "../utils/backEndTypes";

const router = express.Router();

// Route to get all products
router.put(
  "/products/publishStatus/:id",
  productControllers.changeProductStatus
);
router.get("/products/:id", productControllers.getProduct);
router.get("/products", productControllers.getProducts);
router.post(
  "/products",
  upload.single("image"),
  productControllers.uploadProductImage
);

export default router;
