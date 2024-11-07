import React, { useEffect, useState } from "react";
import FolderHeader from "../folderComponents/FolderHeader";
import {
  AllProductsType,
  DashboardSummaryPropsType,
  InventoryItemsPropsType,
  ResponsiveTablePropsType,
} from "../../utils/frontEndTypes";
import { useParams } from "react-router-dom";
import axios from "axios";
import LazyImage from "../lazyLoading/LazyImage";
import DashboardSummary from "./DashboardSummaryCard";
import ResponsiveTable from "../folderComponents/inventoryComponents/ResponsiveTable";
import { inventoryItems } from "../../utils/array";

export default function ViewProduct(
  props: InventoryItemsPropsType
): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [currentProduct, setCurrentProduct] = useState<AllProductsType>({
    productName: "",
    productCategory: "",
    productImage: "",
    sellingPrice: 0,
    dateAdded: undefined,
    inStock: 0,
    discountAmount: 0,
    totalValue: 0,
    action: "publish",
    status: "published",
  });

  useEffect(() => {
    const getCurrentProduct = async () => {
      try {
        const response = await axios.get<AllProductsType[]>(
          `${process.env.REACT_APP_URL}/products/${id}`
        );
        setCurrentProduct(response.data[0]); // Directly setting the first item
      } catch (err) {
        console.log(err);
      }
    };
    getCurrentProduct();
  }, [id]);

  const changePublishStatus = async () => {
    try {
      if (!id) return;
      const newStatus =
        currentProduct.status === "unpublished" ? "published" : "unpublished";

      // Optimistically update the status in the UI before API call
      setCurrentProduct((prevProduct) => ({
        ...prevProduct,
        status: newStatus,
      }));

      const response = await axios.put(
        `${process.env.REACT_APP_URL}/products/publishStatus/${id}`,
        { status: newStatus }
      );

      // Check if the backend update was successful
      if (response.data.message) {
        setCurrentProduct((prevProduct) => ({
          ...prevProduct,
          status: newStatus,
        }));
      }
    } catch (err) {
      console.log("Error updating publish status:", err);
    }
  };

  const totalOrderProps: DashboardSummaryPropsType = {
    state: true,
    image1: "/viewProduct/pie_chart.svg",
    imageBgColor: "#5570F114",
    text1: "Total Orders",
    number1: 50000,
  };

  const viewProps: DashboardSummaryPropsType = {
    image1: "/viewProduct/eye.svg",
    imageBgColor: "#FFCC9129",
    text1: "Views",
    number1: 1200,
    text2: "Favourite",
    number2: 23,
  };

  const allOrdersProps: DashboardSummaryPropsType = {
    fullWidth: true,
    image1: "/viewProduct/big_purse.svg",
    imageBgColor: "#FFCC9129",
    text1: "All Orders",
    number1: 1,
    text2: "Pending",
    number2: 0,
    text3: "Completed",
    number3: 1,
  };

  const canceledOrdersProps: DashboardSummaryPropsType = {
    fullWidth: true,
    image1: "/viewProduct/big_purse.svg",
    imageBgColor: "#FFCC9129",
    text1: "Canceled",
    number1: 0,
    text2: "Returned",
    number2: 0,
    text3: "Damaged",
    number3: 0,
  };

  const responsiveTableProps: ResponsiveTablePropsType = {
    keys: [],
    values: [],
    columnNames: [],
  };

  const capitalizedStatus = currentProduct.status
    ? currentProduct.status.charAt(0).toUpperCase() +
      currentProduct.status.slice(1)
    : "";

  return (
    <div className="w-full relative">
      <FolderHeader text={["/", "View Inventory"]} />
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="w-full flex px-[20px] flex-col gap-[20px] bg-[#F4F5FA] p-[23px_21px_37px]"
      >
        <div className="w-full flex flex-col gap-[20px]">
          <div className="w-full flex justify-between">
            <div className="w-max flex gap-[24px] items-center">
              <div className="w-max">
                <p className="font-inter font-medium text-[1.6rem] leading-[1.21] text-[#45464E]">
                  {currentProduct.productName}
                </p>
              </div>
              <div className="w-max">
                <p className="font-inter font-medium text-[1.6rem] leading-[1.21] text-[#45464E]">
                  Date Added{" "}
                  <span className="font-normal text-[#6E7079]">
                    {currentProduct.dateAdded
                      ? new Date(currentProduct.dateAdded).getDate()
                      : ""}
                  </span>
                  <span className="font-normal text-[#6E7079]">
                    {" "}
                    {currentProduct.dateAdded
                      ? new Date(currentProduct.dateAdded).toLocaleString(
                          "default",
                          {
                            month: "short",
                          }
                        )
                      : "Date not available"}{" "}
                  </span>
                  <span className="font-normal text-[#6E7079]">
                    {" "}
                    {currentProduct.dateAdded
                      ? new Date(currentProduct.dateAdded).getFullYear()
                      : "Date not available"}{" "}
                  </span>
                  <span className="font-normal text-[#6E7079]">-</span>
                  <span className="font-normal text-[#6E7079]">
                    {" "}
                    {currentProduct.dateAdded
                      ? (() => {
                          const date = new Date(currentProduct.dateAdded);
                          const hours = date.getHours();
                          const minutes = date.getMinutes();
                          const formattedHours = hours % 12 || 12; // Convert to 12-hour format
                          const formattedMinutes = minutes
                            .toString()
                            .padStart(2, "0"); // Ensure two-digit minutes
                          const ampm = hours >= 12 ? "PM" : "AM";
                          return `${formattedHours}:${formattedMinutes} ${ampm}`;
                        })()
                      : "Date not available"}
                  </span>
                </p>
              </div>
              <div className="w-max flex items-center gap-[12px]">
                <div className="w-max">
                  <p className="font-inter font-medium text-[1.6rem] leading-[1.21]">
                    Product URL
                  </p>
                </div>
                <div
                  onClick={() =>
                    window.open(currentProduct.productImage, "_blank")
                  }
                  className="w-max flex items-center gap-[12px] cursor-pointer"
                >
                  <p className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#6E7079]">
                    {" "}
                    {currentProduct.productImage
                      ? currentProduct.productImage.split("/").pop()
                      : "Image not available"}
                  </p>
                  <LazyImage
                    src={"/viewProduct/image_url.svg"}
                    alt={""}
                    className="max-w-[20px] max-h-[20px] w-full h-full"
                  />
                </div>
              </div>
            </div>
            <div className="w-max flex gap-[24px]">
              <button className="w-full flex gap-[13px] p-[6px_16px] justify-center items-center rounded-[12px] bg-[#1C1D22] whitespace-nowrap">
                <p className="font-inter font-normal text-[#FFFFFF] text-[1.4rem] leading-[1.21]">
                  Edit Product
                </p>
                <div className="border-[1px] border-[#37393F] w-[2px] h-[24px]" />
                <LazyImage
                  src={"/newProduct/down_arrow_white.svg"}
                  alt={""}
                  className="max-w-[24px] max-h-[24px] w-full h-full"
                />
              </button>
              <button
                onClick={changePublishStatus}
                style={{
                  backgroundColor:
                    currentProduct.status === "unpublished"
                      ? "#5570F1"
                      : "#CC5F5F",
                }}
                className="w-full flex gap-[13px] p-[6px_16px] justify-center items-center rounded-[12px]"
              >
                <p className="font-inter font-normal text-[#FFFFFF] text-[1.4rem] leading-[1.21]">
                  {currentProduct.status === "unpublished"
                    ? "Publish Product"
                    : "Unpublish Product"}
                </p>
              </button>
            </div>
          </div>
          <div className="w-full flex gap-[19px]">
            <div className="max-w-[186px] max-h-[145px] w-full h-full">
              <LazyImage
                src={currentProduct.productImage}
                alt=""
                className="w-full h-full object-contain border-[1px] border-[#E1E2E9] rounded-[12px] bg-[#FFFFFF]"
              />
            </div>
            <div className="max-w-[410px] max-h-[145px] w-full h-full p-[11px_15px] bg-[#FFFFFF] flex flex-col justify-between rounded-[12px]">
              <div className="w-full flex justify-between items-center">
                <div className="w-max">
                  <p className="font-inter font-normal text-[1.2rem] leading-[1.21]">
                    <span className="text-[#6E7079]">Last order</span>{" "}
                    <span className="font-medium text-[#45464E]">
                      {currentProduct.dateAdded
                        ? new Date(currentProduct.dateAdded).getDate()
                        : ""}
                    </span>
                    <span className="font-medium text-[#45464E]">
                      {" "}
                      {currentProduct.dateAdded
                        ? new Date(currentProduct.dateAdded).toLocaleString(
                            "default",
                            {
                              month: "short",
                            }
                          )
                        : "Date not available"}{" "}
                    </span>
                    <span className="font-medium text-[#45464E]">
                      {" "}
                      {currentProduct.dateAdded
                        ? new Date(currentProduct.dateAdded).getFullYear()
                        : "Date not available"}{" "}
                    </span>
                  </p>
                </div>
                <div className="w-max bg-[#32936F29] p-[4px_11px] rounded-[4px]">
                  <p className="font-inter font-normal text-[1.2rem] leading-[1.21] text-center text-[#519C66]">
                    {capitalizedStatus}
                  </p>
                </div>
              </div>
              <div className="w-full flex gap-[32px]">
                <div className="w-full flex flex-col gap-[8px]">
                  <p className="font-inter font-normal text-[1.2rem] leading-[1.21] text-[#8B8D97]">
                    Price
                  </p>
                  <p className="font-inter font-medium text-[1.4rem] leading-[1.21] text-[#45464E]">
                    ₦{currentProduct.sellingPrice}
                  </p>
                </div>
                <div className="w-full flex flex-col gap-[8px]">
                  <p className="font-inter font-normal text-[1.2rem] leading-[1.21] text-[#8B8D97]">
                    In-Stock
                  </p>
                  <p className="font-inter font-medium text-[1.4rem] leading-[1.21] text-[#45464E]">
                    {currentProduct.inStock}
                  </p>
                </div>
              </div>
            </div>
            <DashboardSummary {...totalOrderProps} />
            <DashboardSummary {...viewProps} />
          </div>
          <div className="w-full flex gap-[19px] ">
            <DashboardSummary {...allOrdersProps} />
            <DashboardSummary {...canceledOrdersProps} />
          </div>
          <div className="w-full p-[22px_28px_7px_21px] mb-[46px] max-h-[650px] flex flex-col gap-[20px] bg-[#FFFFFF] rounded-[12px] overflow-auto h-[400px] max-h-[400px]">
            <div className="w-full flex justify-between">
              <div className="w-max py-[5px]">
                <p className="font-inter font-medium text-[1.6rem] leading-[1.21]">
                  Purchases
                </p>
              </div>
              <div className="w-max flex gap-[7px]">
                <div className="max-w-[176px] w-full flex gap-[16px] p-[4.5px_8px] items-center rounded-[4px] border-[1px] border-[#CFD3D4]">
                  <LazyImage
                    src={"/folder/inventoryItems/search.svg"}
                    alt={""}
                    className="max-w-[20px] max-h-[20px] w-full h-full"
                  />
                  <input
                    type="text"
                    className="max-w-[124px] max-h-[13px] w-full h-full font-inter font-normal text-[1.2rem] leading-[1.21] text-[#ABAFB1] outline-none"
                    placeholder="Search"
                  />
                </div>
                <div className="w-max flex gap-[12px]">
                  {inventoryItems.map((inv, index) => (
                    <div key={`inventory-${index}`}>
                      <div className="w-max flex gap-[8px] p-[6.5px_6px] items-center border-[1px] border-[#53545C] rounded-[4px]">
                        <LazyImage
                          src={inv.src}
                          alt={""}
                          className="max-w-[16px] max-h-[16px] w-full h-full"
                        />
                        <p className="font-inter font-normal text-[1.1rem] leading-[1.21] text-[#53545C]">
                          {inv.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="w-max flex flex-row-reverse gap-[8px] p-[6.5px_6px] items-center border-[1px] border-[#53545C] rounded-[4px]">
                    <LazyImage
                      src={"/folder/inventoryItems/inv_items_down_arrow.svg"}
                      alt={""}
                      className="max-w-[16px] max-h-[16px] w-full h-full"
                    />
                    <div className="w-max">
                      <p className="whitespace-nowrap font-inter font-normal text-[1.1rem] leading-[1.21] text-[#53545C]">
                        Bulk Action
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Apply Scrollable Table here */}
            <div className="w-full overflow-auto">
              <ResponsiveTable {...responsiveTableProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
