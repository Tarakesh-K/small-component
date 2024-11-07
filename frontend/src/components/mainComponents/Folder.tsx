import React from "react";
import FolderHeader from "../folderComponents/FolderHeader";
import Inventory from "../folderComponents/Inventory";
import { FolderPropsType } from "../../utils/frontEndTypes";

export default function Folders(props: FolderPropsType): React.JSX.Element {
  return (
    <div className="w-full flex flex-col">
      <FolderHeader />
      <Inventory {...props} />
    </div>
  );
}
