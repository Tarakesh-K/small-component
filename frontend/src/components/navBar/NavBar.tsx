import React, { useState } from "react";
import LazyImage from "../lazyLoading/LazyImage";
import { navBarArrayType, NavBarPropsType } from "../../utils/frontEndTypes";
import { navBarArray } from "../../utils/array";

export default function NavBar(props: NavBarPropsType): React.JSX.Element {
  const [navBarState] = useState<navBarArrayType>(navBarArray);
  const { currentIndex, setCurrentIndex } = props;

  return (
    <div className="max-w-[88px] w-full">
      <div className="w-full flex flex-col justify-between h-screen">
        {/* Logo Section */}
        <div className="lg:max-w-[28px] 2xl:max-w-[49px] lg:max-h-[28px] 2xl:max-h-[49px] w-full h-full mx-auto mt-[24px]">
          <LazyImage
            src={"/navBar/phantasm_logo.svg"}
            alt=""
            className="lg:max-w-[28px] 2xl:max-w-[49px] lg:max-h-[28px] 2xl:max-h-[49px] w-full h-full"
          />
        </div>

        {/* Main Navigation Items */}
        <div className="max-w-[56px] w-full h-full flex flex-col gap-[12px] mx-auto justify-center items-center mt-4">
          {navBarState.slice(0, 6).map((navBar, index) => (
            <div
              key={index}
              className={`cursor-pointer max-w-[30px] max-h-[30px] 2xl:max-w-[56px] 2xl:max-h-[56px] w-full h-full p-[4px] 2xl:p-[16px] rounded-[12px]`}
              style={{
                backgroundColor:
                  index === 3
                    ? "#5570F1"
                    : currentIndex === index
                    ? "#5570F1"
                    : "",
              }}
              onClick={() => setCurrentIndex(index)}
            >
              <LazyImage
                src={navBar.img}
                alt=""
                className="max-w-[30px] 2xl:max-w-[56px] max-h-[30px] 2xl:max-h-[56px] w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Last Three Items with Custom Gap */}
        <div className="w-full flex flex-col items-center justify-center gap-[49px] mt-auto">
          <div className="max-w-[56px] w-full h-full flex flex-col gap-[14px] items-center">
            {navBarState.slice(6, 8).map((navBar, index) => (
              <div
                key={index + 6} // Adjust key to be unique
                className="cursor-pointer max-w-[30px] 2xl:max-w-[56px] max-h-[30px] 2xl:max-h-[56px] w-full h-full p-[4px] 2xl:p-[16px] rounded-[12px]"
                style={{
                  backgroundColor: currentIndex === index + 6 ? "#5570F1" : "",
                }}
                onClick={() => setCurrentIndex(index + 6)}
              >
                <LazyImage
                  src={navBar.img}
                  alt=""
                  className="max-w-[30px] 2xl:max-w-[56px] max-h-[30px] 2xl:max-h-[56px] w-full h-full"
                />
              </div>
            ))}
          </div>

          {/* Logout Icon (last item) */}
          <div onClick={() => setCurrentIndex(8)}>
            <LazyImage
              src={navBarState[8].img}
              alt=""
              className="max-w-[30px] 2xl:max-w-[56px] max-h-[30px] 2xl:max-h-[56px] w-full h-full p-[4px] 2xl:p-[16px] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
