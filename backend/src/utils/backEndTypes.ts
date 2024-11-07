export type ProductType = {
  productName: string;
  productCategory: string;
  sellingPrice: number;
  costPrice: number;
  inStock: number;
  orderType: string; // Optional field
  discountDetails?: { state: boolean; type: string; amount: number };
  expiryDate?: Date | null; // ISO date string format
  shortDescription: string;
  longDescription: string;
  returnPolicy: boolean | string;
  productImage: string;
  dateAdded: Date | string;
  action: "publish" | "unpublish"; // Limited to 'publish' or 'unpublish'
  status: "published" | "unpublished"; // Limited to 'published' or 'unpublished'
};

export type AllProductsType = {
  id?: number;
  productname: string;
  productcategory: string;
  productimage: string;
  sellingprice: number;
  instock: number;
  discountamount: number;
  totalvalue: number;
  action: "publish" | "unpublish";
  status: "published" | "unpublished";
};
