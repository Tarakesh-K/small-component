import React from "react";
import LazyImage from "../lazyLoading/LazyImage";
import { DashboardSummaryPropsType } from "../../utils/frontEndTypes";

export default function DashboardSummary(
  props: DashboardSummaryPropsType
): React.JSX.Element {
  return (
    <div
      style={!props.fullWidth ? { maxWidth: "330px" } : {}}
      className="h-full w-full bg-[#FFFFFF] rounded-[12px] p-[11px_15px] w-full flex flex-col justify-between gap-[30px]"
    >
      <div className="w-full flex justify-between items-center">
        <div
          className="max-w-[36px] max-h-[36px] w-full h-full p-[8px] rounded-[8px]"
          style={{ backgroundColor: props.imageBgColor }}
        >
          <LazyImage
            src={props.image1}
            alt={""}
            className={`max-w-[36px] max-h-[36px] w-full h-full`}
          />
        </div>
        <div className="max-w-[82px] w-full flex gap-[7px] items-center">
          <div className="max-w-[56px] w-full">
            <p className="font-inter text-[1.2rem] leading-[1.21] text-[#BEC0CA]">
              All time
            </p>
          </div>
          <LazyImage src={"/viewProduct/chevron_down.svg"} alt={""} />
        </div>
      </div>
      <div className="w-full flex justify-between">
        <div className="w-full flex flex-col gap-[8px]">
          <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#8B8D97]">
            {props.text1}
          </p>
          <p className="font-poppins font-medium text-[2rem] leading-[1.5] text-[#45464E]">
            {props.state === true ? `₦${props.number1}.00` : props.number1}
          </p>
        </div>
        {props.text2 && (
          <div className="w-full flex flex-col gap-[8px]">
            <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#8B8D97]">
              {props.text2}
            </p>
            <p className="font-poppins font-medium text-[2rem] leading-[1.5] text-[#45464E]">
              {props.number2}
            </p>
          </div>
        )}
        {props.text3 && (
          <div className="w-full flex flex-col gap-[8px]">
            <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#8B8D97]">
              {props.text3}
            </p>
            <p className="font-poppins font-medium text-[2rem] leading-[1.5] text-[#45464E]">
              {props.number3}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
