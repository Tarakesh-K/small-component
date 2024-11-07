import { Request, Response } from "express";
import {
  insertProduct,
  getTotalProducts,
  getCurrentProduct,
  changePublishStatus,
} from "../models/productModels";
import { ProductType } from "../utils/backEndTypes";
import fs from "fs";
import path from "path";
import "dotenv/config";

const getProduct = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getCurrentProduct(id);
    res.status(200).json(product);
  } catch (err: unknown) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

// Controller to fetch all products
const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getTotalProducts();
    res.status(200).json(products);
  } catch (err: unknown) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

const changeProductStatus = async (
  req: Request<
    { id: number | string },
    {},
    { status: "published" | "unpublished" }
  >,
  res: Response
): Promise<any> => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const numericId = parseInt(id as string, 10);

    // Validate inputs
    if (
      !status ||
      !id ||
      (status !== "published" && status !== "unpublished") ||
      isNaN(numericId)
    ) {
      return res.status(400).json({ error: "Values error" });
    }

    // Attempt to change the publish status
    const result = await changePublishStatus(numericId, status);

    // If result contains a message (status was already the same), return that message
    if (result.message) {
      return res.status(200).json({ message: result.message });
    }

    // Otherwise, status was successfully updated
    return res.status(200).json({
      message: `Product ${numericId} status updated to ${status}`,
    });
  } catch (err: unknown) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to change product status" });
  }
};

// Controller to handle product image upload
// Inside the uploadProductImage function
const uploadProductImage = async (
  req: Request<{}, {}, ProductType>,
  res: Response<{}, {}>
): Promise<any> => {
  const file = req.file;
  let filePath: string = "";
  if (file) {
    filePath = path.join(__dirname, "../../upload/images", file.filename);
  }
  try {
    const {
      productName,
      productCategory,
      sellingPrice,
      costPrice,
      inStock,
      orderType,
      discountDetails,
      expiryDate,
      shortDescription,
      longDescription,
      returnPolicy,
      dateAdded,
      status,
      action,
    } = req.body;
    console.log(req.body);
    // Ensure the file is provided
    if (!file) return res.status(400).json({ error: "No image uploaded" });

    // Ensure required fields are valid
    if (
      !productName ||
      !productCategory ||
      isNaN(Number(sellingPrice)) ||
      isNaN(Number(costPrice)) ||
      isNaN(Number(inStock)) ||
      !orderType ||
      !shortDescription ||
      !longDescription ||
      !Date.parse(String(dateAdded)) || // Check if dateAdded is valid
      (status && !["published", "unpublished"].includes(status)) ||
      (action &&
        !["publish", "unpublish"].includes(action) &&
        status !== "unpublished")
    ) {
      const sellingPriceNum = Number(sellingPrice);
      const costPriceNum = Number(costPrice);
      const inStockNum = Number(inStock);

      // Validate numbers
      if (isNaN(sellingPriceNum) || isNaN(costPriceNum) || isNaN(inStockNum)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting the file:", err);
          } else {
            console.log("Invalid attributes, file deleted.");
          }
        });

        return res.status(400).json({
          error: "Some of the attributes are missing or invalid",
        });
      }
    }

    // Default the dateAdded to the current time if invalid or missing
    const parsedDateAdded =
      dateAdded && (typeof dateAdded === "string" || dateAdded instanceof Date)
        ? new Date(dateAdded).toISOString() // Convert to ISO string format
        : new Date().toISOString(); // Default to current timestamp

    // Type conversions for numbers and booleans
    const parsedSellingPrice = Number(sellingPrice);
    const parsedCostPrice = Number(costPrice);
    const parsedInStock = Number(inStock);
    const parsedReturnPolicy =
      String(returnPolicy).toLowerCase() === "true" ? true : false;

    // Ensure valid numeric fields
    if (
      isNaN(parsedSellingPrice) ||
      isNaN(parsedCostPrice) ||
      isNaN(parsedInStock)
    ) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        } else {
          console.log("Invalid attributes, file deleted.");
        }
      });
      return res.status(400).json({ error: "Invalid numeric values" });
    }

    // Prepare the product data with the corrected date
    const productData: ProductType = {
      productName,
      productCategory,
      sellingPrice: parsedSellingPrice,
      costPrice: parsedCostPrice,
      inStock: parsedInStock,
      orderType,
      discountDetails,
      expiryDate: expiryDate,
      shortDescription,
      longDescription,
      returnPolicy: parsedReturnPolicy,
      productImage: `${process.env.IMAGE_URL}/${file.filename}`,
      dateAdded: parsedDateAdded, // Use the valid timestamp
      status,
      action,
    };

    // Insert the product into the database using the model function
    const productId = await insertProduct(productData);

    res.status(201).json({
      message: "Product uploaded successfully",
      productId,
    });
  } catch (err: unknown) {
    // Attempt to delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Error deleting the file:", err);
      } else {
        console.log("Invalid attributes, file deleted.");
      }
    });
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to upload product" });
  }
};

export default {
  getProduct,
  changeProductStatus,
  getProducts,
  uploadProductImage,
};
