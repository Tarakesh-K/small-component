import { ResponsiveTablePropsType } from "../../../utils/frontEndTypes";
import LazyImage from "../../lazyLoading/LazyImage";
import { useNavigate } from "react-router-dom";

const ResponsiveTable = (
  props: ResponsiveTablePropsType
): React.JSX.Element => {
  const navigate = useNavigate();
  const { keys, values, columnNames } = props;

  return values.length > 0 ? (
    <div className="w-full rounded-[4px] overflow-auto">
      <table className="w-full border-collapse border-spacing-0 border border-gray-300 table-auto">
        <thead className="sticky top-0 z-[10] bg-[#FFFFFF] border-t-[1px] border-b-[1px] border-0 border-[#F5F5F5]">
          <tr>
            {columnNames.map((key, index) => (
              <th
                key={index}
                className="py-[14px] font-normal text-[1.4rem] leading-[1.21] text-[#2C2D33] text-left whitespace-nowrap"
                style={{ minWidth: "100px" }}
              >
                <div className="flex items-center gap-2">
                  <p>{keys[index] === "productImage" ? "" : key}</p>
                  {keys[index] !== "productImage" && (
                    <LazyImage
                      src={"/folder/inventoryItems/sort.svg"}
                      alt="Sort"
                      className="max-w-[16px] max-h-[16px] w-full h-full"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, rowIndex) => (
            <tr
              onClick={() => navigate(`${rowIndex + 1}/view-product`)}
              className="cursor-pointer"
              key={rowIndex}
            >
              {row.map((value, colIndex) => (
                <td key={colIndex} className="py-[6px]">
                  {keys[colIndex] === "action" ? (
                    <div className="inline-flex items-center gap-[8px] w-max bg-[#5E636614] p-[3.5px_8px] text-[#8B8D97] text-nowrap rounded-[8px] text-[1.2rem] leading-[1.21] items-center">
                      {typeof value === "string"
                        ? value.charAt(0).toUpperCase() + value.slice(1)
                        : value}
                      <LazyImage
                        src="/folder/inventoryItems/fi_chevron-down.svg"
                        alt="Dropdown Arrow"
                      />
                    </div>
                  ) : keys[colIndex] === "status" ? (
                    <div
                      className={`inline-flex items-center gap-[8px] w-max ${
                        value === "published"
                          ? "bg-[#5570F129] text-[#5570F1] rounded-[8px] p-[4px_8px] text-[1.2rem] leading-[1.21]"
                          : "bg-[#FFF2E2] text-[#1C1D22] rounded-[8px] p-[4px_8px] text-[1.2rem] leading-[1.21]"
                      }`}
                    >
                      {typeof value === "string"
                        ? value.charAt(0).toUpperCase() + value.slice(1)
                        : value}
                    </div>
                  ) : keys[colIndex] === "productImage" ? (
                    <LazyImage
                      src={value} // URL for product image
                      alt="Product"
                      className="w-[50px] h-[50px] object-contain mx-auto"
                    />
                  ) : typeof value === "string" ? (
                    <span className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#6E7079]">
                      {keys[colIndex] === "sellingPrice" ||
                      keys[colIndex] === "inStock" ||
                      keys[colIndex] === "discount" ||
                      keys[colIndex] === "totalValue"
                        ? `₦${value}`
                        : value.charAt(0).toUpperCase() + value.slice(1)}
                    </span>
                  ) : (
                    <span className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#6E7079]">
                      {value}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="flex items-center justify-center p-[20px] text-[1.4rem]">
      No data available
    </div>
  );
};

export default ResponsiveTable;
