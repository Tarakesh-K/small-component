import React, { useEffect, useState } from "react";
import LazyImage from "../../lazyLoading/LazyImage";
import { inventoryItems } from "../../../utils/array";
import ResponsiveTable from "./ResponsiveTable";
import {
  AllProductsType,
  InventoryItemsPropsType,
  ResponsiveTablePropsType,
} from "../../../utils/frontEndTypes";

export default function InventoryItems(
  props: InventoryItemsPropsType
): React.JSX.Element {
  const { allProducts, columnNames } = props;
  const [tableData, setTableData] = useState<ResponsiveTablePropsType>({
    keys: [],
    values: [],
    columnNames: [],
  });

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const keys = Object.keys(allProducts[0]);
      const values = allProducts.map((product) => Object.values(product));
      setTableData({ keys, values, columnNames: columnNames });
    }
  }, [allProducts]);

  const arrOrder = [
    "Product Image",
    "Product Name",
    "Category",
    "Selling Price",
    "In-Stock",
    "Discount",
    "Total Value",
    "Action",
    "Status",
  ];
  const orderedArrOrder = arrOrder;

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Filter keys while excluding "id"
      const keys = (
        Object.keys(allProducts[0]) as Array<keyof AllProductsType>
      ).filter((key) => key !== "id");

      const values = allProducts.map((product) =>
        keys.map((key) => product[key])
      );

      setTableData({ keys, values, columnNames: columnNames });
    }
  }, [allProducts]);

  const responsiveTableProps: ResponsiveTablePropsType = {
    keys: tableData.keys,
    values: tableData.values,
    columnNames: orderedArrOrder,
  };

  return (
    <div className="w-full p-[22px_28px_7px_21px] mb-[46px] max-h-[650px] flex flex-col gap-[20px] bg-[#FFFFFF] rounded-[12px] overflow-auto">
      <div className="w-full flex justify-between">
        <div className="w-max py-[5px]">
          <p className="font-inter font-medium text-[1.6rem] leading-[1.21]">
            Inventory Items
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
      <div className="w-full overflow-x-auto">
        <ResponsiveTable {...responsiveTableProps} />
      </div>
    </div>
  );
}
