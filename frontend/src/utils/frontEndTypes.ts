export type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export type navBarArrayType = {
  img: string;
  bgColor?: string;
}[];

export type NavBarPropsType = {
  currentIndex: number | null;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

export type ResponsiveTablePropsType = {
  keys: string[]; // Array of strings (keys for the columns)
  values: any[][];
  columnNames: string[];
};

export type ToggleButtonPropsType = {
  isToggled: boolean;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
};

export type InventorySummaryPropsType = {
  activeProducts: number;
  allProducts: number;
  expiredProducts: number;
  activeProductsPercentage: number;
};

export type FolderPropsType = {
  productsData: InventoryItemsPropsType;
  inventorySummary: InventorySummaryPropsType;
};

export type ProductType = {
  image: File | null;
  productName: string;
  productCategory: string;
  sellingPrice: number | string;
  costPrice: number | string;
  inStock: number | string;
  orderType: string; // Optional field
  discountDetails?: { state: boolean; type: string; amount: number | string };
  expiryDate?: { state: boolean; date: string | null };
  shortDescription: string;
  longDescription: string;
  returnPolicy: boolean;
  dateAdded: string;
  action: "publish" | "unpublish";
  status: "published" | "unpublished";
};

export type AllProductsType = {
  id?: number;
  productName: string;
  productCategory: string;
  productImage: string;
  sellingPrice: number;
  dateAdded?: string | Date;
  inStock: number;
  discountAmount: number;
  totalValue: number;
  action: "publish" | "unpublish";
  status: "published" | "unpublished";
};

export type InventoryItemsPropsType = {
  allProducts: AllProductsType[];
  columnNames: string[];
};

export type ViewProductPropsType = {
  productData: InventoryItemsPropsType;
  setProductData: React.Dispatch<React.SetStateAction<InventoryItemsPropsType>>;
};

export type GetTotalProductsType = {
  columnNames: string[];
  allProducts: AllProductsType[];
  totalRows: number;
  activeProductsCount: number;
  activeProductsPercentage: number;
  inActiveProductsCount: number;
};

export type DashboardSummaryPropsType = {
  fullWidth?: boolean;
  state?: boolean;
  image1: string;
  imageBgColor: string;
  text1: string;
  text2?: string;
  text3?: string;
  number1: number;
  number2?: number;
  number3?: number;
};
