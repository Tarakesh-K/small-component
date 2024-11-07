import pool from "../db"; // PostgreSQL connection pool
import { AllProductsType, ProductType } from "../utils/backEndTypes";

export const getCurrentProduct = async (id: number) => {
  const response = await pool.query(
    `
    SELECT 
      product_name AS "productName",
      product_image AS "productImage",
      date_added AS "dateAdded",
      product_category AS "productCategory",
      selling_price AS "sellingPrice",
      in_stock AS "inStock",
      discount_amount AS "discountAmount",
      total_value AS "totalValue",
      status AS "status"
    FROM products
    WHERE id = $1
  `,
    [id]
  );

  // The result from the query will now have camelCase keys
  return response.rows;
};

export const changePublishStatus = async (
  id: number,
  status: "published" | "unpublished"
) => {
  try {
    // Query to get the current status of the product
    const currentProduct = await pool.query(
      `SELECT status FROM products WHERE id = $1`,
      [id]
    );

    // If the product doesn't exist
    if (currentProduct.rowCount === 0) {
      throw new Error(`Product with id ${id} not found`);
    }

    const currentStatus = currentProduct.rows[0].status;

    // If the status is the same as the current one, return a message
    if (currentStatus === status) {
      return { message: `Product already ${status}` };
    }

    // Update the product status if it's different
    const response = await pool.query(
      `
        UPDATE products
        SET status = $1
        WHERE id = $2
      `,
      [status, id]
    );

    // If no rows were updated, the product might not exist
    if (response.rowCount === 0) {
      throw new Error(`Product with id ${id} not found`);
    }

    // Return the updated row (the entire product)
    return { message: `Successfully changed status` };
  } catch (err: unknown) {
    console.error("Database error:", err);
    throw new Error("Failed to change status");
  }
};

export const getTotalProducts = async () => {
  try {
    // Query to get all products including the id
    const response = await pool.query<AllProductsType>(`
      SELECT 
        id,  -- Select the product id
        product_image AS productImage,
        product_name AS productName,
        product_category AS productCategory,
        selling_price AS sellingPrice,
        in_stock AS inStock,
        discount_amount AS discountAmount,
        total_value AS totalValue,
        action,
        status
      FROM products
    `);

    // Query to get the count of active products (status = 'published')
    const activeProductsCountResponse = await pool.query<{
      activeproductscount: number;
    }>(`
      SELECT COUNT(*) AS activeProductsCount
      FROM products
      WHERE status = 'published'
    `);

    // Query to get the count of inactive products (status = 'unpublished')
    const inActiveProductsCountResponse = await pool.query<{
      inactiveproductscount: number;
    }>(`
      SELECT COUNT(*) AS inActiveProductsCount
      FROM products
      WHERE status = 'unpublished'
    `);

    // Extract the active and inactive product counts
    const activeProductsCount: number = Number(
      activeProductsCountResponse.rows[0].activeproductscount
    );
    const inActiveProductsCount: number = Number(
      inActiveProductsCountResponse.rows[0].inactiveproductscount
    );

    const totalRows: number = response.rowCount as number;
    const activePercentage =
      totalRows > 0 ? (activeProductsCount / totalRows) * 100 : 0;

    // Map response rows to match the desired order and include id
    const allProducts = response.rows
      .map((row) => ({
        id: row.id, // Include product id
        productImage: row.productimage, // 1. Image
        productName: row.productname, // 2. Product name
        productCategory: row.productcategory, // 3. Category
        sellingPrice: isNaN(Number(row.sellingprice))
          ? row.sellingprice
          : Number(row.sellingprice), // 4. Selling price
        inStock: isNaN(Number(row.instock)) ? row.instock : Number(row.instock), // 5. In stock
        discountAmount: isNaN(Number(row.discountamount))
          ? row.discountamount
          : Number(row.discountamount), // 6. Discount
        totalValue: isNaN(Number(row.totalvalue))
          ? row.totalvalue
          : Number(row.totalvalue), // 7. Total value
        action: row.action, // 8. Action
        status: row.status, // 9. Status
      }))
      .sort((a, b) => Number(a.id) - Number(b.id)); // Sort by `id` in ascending order

    const columnNames: string[] = [
      "product_image",
      "product_name",
      "product_category",
      "selling_price",
      "in_stock",
      "discount_amount",
      "total_value",
      "action",
      "status",
    ];

    // Return the results with the data in the specified order, including the product id
    return {
      columnNames,
      allProducts,
      totalRows,
      activeProductsCount,
      activeProductsPercentage: activePercentage,
      inActiveProductsCount,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

// Function to insert a product into the database
export const insertProduct = async (productData: ProductType) => {
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
    productImage,
    dateAdded,
    status,
    action,
  } = productData;

  // Build the SQL query to insert the product into the 'products' table
  const query = `
    INSERT INTO products (
      product_name,
      product_category,
      selling_price,
      cost_price,
      in_stock,
      order_type,
      discount_amount,
      expiry_date,
      short_description,
      long_description,
      return_policy,
      product_image,
      date_added,
      status,
      action
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id;  -- This will return the ID of the inserted row
  `;

  // Array of values to be inserted
  const values = [
    productName,
    productCategory,
    Number(sellingPrice),
    Number(costPrice),
    Number(inStock),
    orderType,
    discountDetails && Number(discountDetails.amount), // Default values if no discountDetails is provided
    expiryDate || null, // Set to null if no expiry date is provided
    shortDescription,
    longDescription,
    returnPolicy || false, // Default to false if not provided
    productImage,
    dateAdded,
    status,
    action,
  ];

  // Execute the query and return the result
  const result = await pool.query(query, values);
  return result.rows[0].id; // Return the ID of the inserted product
};
