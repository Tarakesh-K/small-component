import { InventorySummaryPropsType } from "../../../utils/frontEndTypes";
import LazyImage from "../../lazyLoading/LazyImage";
import { useNavigate } from "react-router-dom";

export default function InventorySummary(
  props: InventorySummaryPropsType
): React.JSX.Element {
  const navigate = useNavigate();
  const {
    activeProducts,
    activeProductsPercentage,
    allProducts,
    expiredProducts,
  } = props;

  return (
    <div className="w-full flex flex-col gap-[20px]">
      <div className="w-full flex justify-between items-center">
        <div className="w-max">
          <p className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#45464E]">
            Inventory Summary
          </p>
        </div>
        <div className="max-w-[205px] w-full">
          <button
            onClick={() => navigate("/new-product")}
            className="w-full flex gap-[8px] p-[6px_22px] items-center rounded-[12px] bg-[#5570F1]"
          >
            <LazyImage
              src={"/folder/inventorySummary/plus.svg"}
              alt={""}
              className="max-w-[24px] max-h-[24px] w-full h-full"
            />
            <p className="font-inter font-normal text-[#FFFFFF] text-[1.4rem] leading-[1.21]">
              Add a New Product
            </p>
          </button>
        </div>
      </div>
      <div className="w-full flex gap-[19px]">
        <div className="w-full bg-[#5570F1] rounded-[12px]">
          <div className="w-full p-[11px_15px] flex flex-col gap-[32px]">
            <div className="max-w-[36px] max-h-[36px] w-full h-full">
              <LazyImage
                src={"/folder/inventorySummary/folder_alt_icon.svg"}
                alt={""}
                className="max-w-[36px] max-h-[36px] w-full h-full"
              />
            </div>
            <div className="w-full flex gap-[32px] text-[#FFFFFF]">
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[1.4rem] leading-[1.21]">
                  All Products
                </p>
                <p className="font-poppins font-medium text-[2rem] leading-[1.5]">
                  {allProducts}
                </p>
              </div>
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[1.4rem] leading-[1.21]">
                  Active
                </p>
                <p className="font-poppins font-medium text-[2rem] leading-[1.5] flex gap-[7px] items-center">
                  <span>{activeProducts}</span>
                  <span className="font-inter font-normal text-[1.2rem] leading-[1.21]">
                    {activeProductsPercentage.toFixed(2)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full rounded-[12px]">
          <div className="w-full p-[11px_15px] flex flex-col gap-[32px]">
            <div className="w-full flex justify-between items-center">
              <div className="max-w-[36px] max-h-[36px] w-full h-full">
                <LazyImage
                  src={"/folder/inventorySummary/two_user_black.svg"}
                  alt={""}
                  className="max-w-[36px] max-h-[36px] w-full h-full"
                />
              </div>
              <button className="w-max flex gap-[7px]">
                <p className="font-inter font-normal text-[1.2rem] leading-[1.21] text-[#BEC0CA]">
                  This Week
                </p>
                <LazyImage
                  src={"/folder/inventorySummary/inv_down_arrow.svg"}
                  alt={""}
                  className="max-w-[16px] max-h-[16px] w-full h-full"
                />
              </button>
            </div>
            <div className="w-full flex gap-[32px]">
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[#CC5F5F] text-[1.4rem] leading-[1.21]">
                  Low Stock Alert
                </p>
                <p className="font-poppins font-medium text-[2rem] leading-[1.5] text-[#45464E]">
                  23
                </p>
              </div>
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[#8B8D97] text-[1.4rem] leading-[1.21]">
                  Expired
                </p>
                <p className="font-poppins font-medium text-[2rem] leading-[1.5] text-[#45464E]">
                  {expiredProducts}
                </p>
              </div>
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[#8B8D97] text-[1.4rem] leading-[1.21]">
                  1 Start Rating
                </p>
                <p className="font-poppins font-medium text-[2rem] leading-[1.5] text-[#45464E]">
                  2
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
