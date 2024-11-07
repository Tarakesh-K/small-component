import React, { useState } from "react";
import { ToggleButtonPropsType } from "../../utils/frontEndTypes";

const ToggleButton = (props: ToggleButtonPropsType) => {
  const { isToggled, setIsToggled } = props;

  const toggleHandler = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div
      onClick={toggleHandler}
      className={`w-16 h-8 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
        isToggled
          ? "bg-[#5570F166]" // Blue background with 40% opacity
          : "bg-[#5570F11F]" // Blue background with 12% opacity
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full transition-all duration-300 transform ${
          isToggled
            ? "translate-x-8 bg-[#5570F1]"
            : "translate-x-0 bg-[#BBC5CB]"
        }`}
      />
    </div>
  );
};

export default ToggleButton;
