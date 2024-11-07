import React from "react";
import InventorySummary from "./inventoryComponents/InventorySummary";
import InventoryItems from "./inventoryComponents/InventoryItems";
import { FolderPropsType } from "../../utils/frontEndTypes";

export default function Inventory(props: FolderPropsType): React.JSX.Element {
  const { inventorySummary, productsData } = props;

  return (
    <div className="w-full flex px-[20px] flex-col gap-[20px] bg-[#F4F5FA] pt-[23px]">
      <InventorySummary {...inventorySummary} />
      <InventoryItems {...productsData} />
    </div>
  );
}
