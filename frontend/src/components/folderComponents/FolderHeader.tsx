import LazyImage from "../lazyLoading/LazyImage";
import { useNavigate } from "react-router-dom";

export default function FolderHeader({ text }: { text?: string[] }) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <div className="w-max p-[21px_14px]">
          <p className="font-poppins font-medium text-[2rem] leading-[1.5]">
            Inventory
          </p>
        </div>
        <div className="max-w-[246px] w-full flex gap-[20px] items-center">
          <div className="max-w-[158px] w-full flex justify-between items-center p-[6px_12px] gap-[20px]">
            <p className="font-inter font-normal text-[1.4rem] leading-[1.21]">
              Nanny's Shop
            </p>
            <button>
              <LazyImage
                src={"/folder/down_arrow.svg"}
                alt={""}
                className="max-w-[20px] max-h-[20px] w-full h-full"
              />
            </button>
          </div>
          <div className="max-w-[20px] max-h-[20px] h-full">
            <LazyImage
              src={"/folder/notification.svg"}
              alt={""}
              className="max-w-[20px] max-h-[20px] w-full h-full"
            />
          </div>
          <div className="max-h-[32px] max-w-[32px] w-full h-full">
            <LazyImage src={""} alt={""} className="rounded-[8px]" />
          </div>
        </div>
      </div>
      <div className="w-full flex py-[4px] gap-[11px] ml-[16px]">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <LazyImage
            src={"/folder/home.svg"}
            alt={""}
            className="max-w-[16px] max-h-[16px] w-full h-full"
          />
        </div>
        <p className="font-inter font-normal text-[12px] leading-[1.21] text-[#8B8D97]">
          /
        </p>
        <p
          className={`font-inter font-normal text-[12px] leading-[1.21] ${
            text ? "text-[#5570F1]" : "text-[#8B8D97]"
          }`}
        >
          Inventory
        </p>
        {text &&
          text.map((tex, index) => (
            <p
              className="font-inter font-normal text-[12px] leading-[1.21] text-[#8B8D97]"
              key={`tex-${index}`}
            >
              {tex}
            </p>
          ))}
      </div>
    </div>
  );
}
