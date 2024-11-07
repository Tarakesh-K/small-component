import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FolderHeader from "../folderComponents/FolderHeader";
import LazyImage from "../lazyLoading/LazyImage";
import ToggleButton from "./ToggleButton";
import axios from "axios";
import { ProductType, ToggleButtonPropsType } from "../../utils/frontEndTypes";

export default function NewProduct(): React.JSX.Element {
  const navigate = useNavigate();
  const [message, setMessage] = useState<boolean>(false);
  const [discountToggle, setDiscountToggle] = useState<boolean>(false);
  const [expiredDateToggle, setExpiredDateToggle] = useState<boolean>(false);
  const [returnPolicyToggle, setReturnPolicyToggle] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductType>({
    image: null,
    productName: "",
    productCategory: "",
    sellingPrice: "",
    costPrice: "",
    inStock: "",
    orderType: "",
    discountDetails: { state: false, type: "", amount: "" },
    expiryDate: { state: false, date: "" },
    shortDescription: "",
    longDescription: "",
    returnPolicy: false,
    dateAdded: "",
    action: "unpublish",
    status: "unpublished",
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click
  const handleImageClick = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const updateProduct = (key: keyof ProductType, value: any) => {
    if (key === "discountDetails") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [key]:
          key === "discountDetails"
            ? { ...prevProduct.discountDetails, ...value } // Spread discountDetails and merge `value`
            : value, // Directly update other fields
      }));
    } else if (key === "expiryDate") {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [key]:
          key === "expiryDate"
            ? { ...prevProduct.expiryDate, ...value } // Spread discountDetails and merge `value`
            : value, // Directly update other fields
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [key]: value,
      }));
    }
  };

  useEffect(() => {
    updateProduct("discountDetails", {
      ...product.discountDetails, // Keep the rest of discountDetails
      state: discountToggle, // Update only `type`
    });
  }, [discountToggle]);

  useEffect(() => {
    updateProduct("expiryDate", {
      ...product.discountDetails, // Keep the rest of discountDetails
      state: expiredDateToggle, // Update only `type`
    });
  }, [expiredDateToggle]);

  useEffect(() => {
    updateProduct("returnPolicy", returnPolicyToggle);
  }, [returnPolicyToggle]);

  const handleClick = () => {
    // Focus the input when the wrapper div is clicked
    dateInputRef.current?.focus();
  };

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        "image/webp")
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
      updateProduct("image", file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();

      // Temporarily set action and status to publish and published before submission
      updateProduct("action", "publish");
      updateProduct("status", "published");

      const formData = new FormData();

      // Append the fields of the product state to FormData
      formData.append("productName", product.productName);
      formData.append("productCategory", product.productCategory);
      formData.append("sellingPrice", String(product.sellingPrice));
      formData.append("costPrice", String(product.costPrice));
      formData.append("inStock", String(product.inStock));
      formData.append("orderType", product.orderType);

      if (discountToggle === true && product.discountDetails) {
        formData.append(
          "discountDetails[state]",
          String(product.discountDetails.state ?? "")
        );
        formData.append(
          "discountDetails[type]",
          product.discountDetails.type ?? ""
        );
        formData.append(
          "discountDetails[amount]",
          String(product.discountDetails.amount ?? "")
        );
      }

      if (expiredDateToggle === true && product.expiryDate?.date) {
        formData.append("expiryDate", product.expiryDate?.date);
      }

      formData.append("shortDescription", product.shortDescription);
      formData.append("longDescription", product.longDescription);
      formData.append("returnPolicy", String(product.returnPolicy)); // Random boolean for returnPolicy
      formData.append("dateAdded", String(product.dateAdded)); // Add the current timestamp

      // Append the action and status values to the form data
      formData.append("status", "published"); // This will be 'published'
      formData.append("action", "publish"); // This will be 'publish'

      // Append the image file (if it exists)
      if (product.image) {
        formData.append("image", product.image);
      }

      // Send the form data to the backend using axios
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/products`,
        formData, // Send the FormData as the body
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header
          },
        }
      );

      // Check for successful status code (201 Created or 200 OK)
      if (response.status === 201 || response.status === 200) {
        console.log("Product uploaded successfully", response.data);
        // After success, set action and status back to unpublish and unpublished
        updateProduct("action", "unpublish");
        updateProduct("status", "unpublished");
        setMessage(true);
      } else {
        console.error("Error uploading product:", response.data.error);
        alert("Couldn't create product");

        // In case of failure, set action and status back to unpublish and unpublished
        updateProduct("action", "unpublish");
        updateProduct("status", "unpublished");
      }
    } catch (err: unknown) {
      console.error("Error in submitting product:", err);
      alert("Couldn't create product");

      // In case of error, set action and status back to unpublish and unpublished
      updateProduct("action", "unpublish");
      updateProduct("status", "unpublished");
    }
  };

  const handleSaveDraft = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();

      // Temporarily set action and status to publish and published before submission
      updateProduct("action", "publish");
      updateProduct("status", "published");

      const formData = new FormData();

      // Append the fields of the product state to FormData
      formData.append("productName", product.productName);
      formData.append("productCategory", product.productCategory);
      formData.append("sellingPrice", String(product.sellingPrice));
      formData.append("costPrice", String(product.costPrice));
      formData.append("inStock", String(product.inStock));
      formData.append("orderType", product.orderType);

      if (discountToggle === true && product.discountDetails) {
        formData.append(
          "discountDetails[state]",
          String(product.discountDetails.state)
        );
        formData.append("discountDetails[type]", product.discountDetails.type);
        formData.append(
          "discountDetails[amount]",
          String(product.discountDetails.amount)
        );
      }

      if (expiredDateToggle === true && product.expiryDate?.date) {
        const expiryDateString = product.expiryDate.date;
        formData.append("expiryDate", String(expiryDateString));
      }

      formData.append("shortDescription", product.shortDescription);
      formData.append("longDescription", product.longDescription);
      formData.append("returnPolicy", String(product.returnPolicy)); // Random boolean for returnPolicy
      formData.append("dateAdded", String(product.dateAdded)); // Add the current timestamp

      // Append the action and status values to the form data
      formData.append("status", "unpublished"); // This will be 'published'
      formData.append("action", "unpublish"); // This will be 'publish'

      // Append the image file (if it exists)
      if (product.image) {
        formData.append("image", product.image);
      }

      // Send the form data to the backend using axios
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/products`,
        formData, // Send the FormData as the body
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header
          },
        }
      );

      // Check for successful status code (201 Created or 200 OK)
      if (response.status === 201 || response.status === 200) {
        console.log("Product uploaded successfully", response.data);

        // After success, set action and status back to unpublish and unpublished
        updateProduct("action", "unpublish");
        updateProduct("status", "unpublished");
        setMessage(true);
      } else {
        console.error("Error uploading product:", response.data.error);
        alert("Couldn't save draft");

        // In case of failure, set action and status back to unpublish and unpublished
        updateProduct("action", "unpublish");
        updateProduct("status", "unpublished");
      }
    } catch (err: unknown) {
      console.error("Error in submitting product:", err);
      alert("Couldn't save draft");

      // In case of error, set action and status back to unpublish and unpublished
      updateProduct("action", "unpublish");
      updateProduct("status", "unpublished");
    }
  };

  const discountToggleProps: ToggleButtonPropsType = {
    isToggled: discountToggle,
    setIsToggled: setDiscountToggle,
  };

  const expiredDateToggleProps: ToggleButtonPropsType = {
    isToggled: expiredDateToggle,
    setIsToggled: setExpiredDateToggle,
  };

  const returnPolicyToggleProps: ToggleButtonPropsType = {
    isToggled: returnPolicyToggle,
    setIsToggled: setReturnPolicyToggle,
  };

  return (
    <div className="w-full relative">
      <FolderHeader text={["/", "New Inventory"]} />
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="w-full flex px-[20px] flex-col gap-[20px] bg-[#F4F5FA]"
      >
        {message && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 max-w-[400px] w-full bg-[#F5F5F5] p-4 rounded-md shadow-lg">
            <div className="w-max mx-auto">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 text-[1.6rem] leading-[1.21]"
              >
                Successfully created
              </button>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col gap-[20px] mt-[23px]">
          <div className="w-full flex justify-between items-center">
            <div className="w-max">
              <p className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#45464E]">
                New Inventory Item
              </p>
            </div>
            <div className="max-w-[356px] w-full flex gap-[24px]">
              <div className="max-w-[161px] w-full">
                <button
                  onClick={(e) => handleSaveDraft(e)}
                  className="w-full flex gap-[13px] py-[6px] justify-center items-center rounded-[12px] bg-[#1C1D22]"
                >
                  <p className="font-inter font-normal text-[#FFFFFF] text-[1.4rem] leading-[1.21]">
                    Save as Draft
                  </p>
                  <div className="border-[1px] border-[#37393F] w-[2px] h-[24px]" />
                  <LazyImage
                    src={"/newProduct/down_arrow_white.svg"}
                    alt={""}
                    className="max-w-[24px] max-h-[24px] w-full h-full"
                  />
                </button>
              </div>
              <div className="max-w-[161px] w-full">
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  className="w-full flex gap-[8px] py-[9.5px] items-center rounded-[12px] bg-[#5570F1] justify-center"
                >
                  <p className="font-inter font-normal text-[#FFFFFF] text-[1.4rem] leading-[1.21]">
                    Save & Publish
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-[20px] mb-[48px]">
          <div
            style={{ height: "calc(100vh - 200px)" }}
            className="max-w-[881px] w-full bg-[#FFFFFF] rounded-[12px] flex gap-[66.5px] justify-between p-[28px_33px_0px_30.5px]"
          >
            <div className="max-w-[375px] w-full flex flex-col gap-[24px]">
              <input
                type="text"
                className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                placeholder="Product Name"
                onChange={(e) => updateProduct("productName", e.target.value)}
                value={product.productName}
              />
              <select
                className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                onChange={(e) =>
                  updateProduct("productCategory", e.target.value)
                }
                value={product.productCategory}
              >
                <option value="" disabled>
                  Select Product Category
                </option>
                <option value="gadgets">Gadgets</option>
                <option value="fashion">Fashion</option>
                <option value="home_appliances">Home Appliances</option>
                <option value="books">Books</option>
                <option value="beauty_and_personal_care">
                  Beauty & Personal Care
                </option>
                <option value="sports">Sports</option>
                <option value="toys_and_games">Toys & Games</option>
                <option value="health_and_wellness">Health & Wellness</option>
                <option value="furniture">Furniture</option>
              </select>
              <div className="w-full flex gap-[12px]">
                <input
                  type="number"
                  className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                  placeholder="Selling Price"
                  onChange={(e) =>
                    updateProduct("sellingPrice", Number(e.target.value))
                  }
                  value={product.sellingPrice as number}
                />
                <input
                  type="number"
                  className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                  placeholder="Cost Price"
                  onChange={(e) =>
                    updateProduct("costPrice", Number(e.target.value))
                  }
                  value={product.costPrice as number}
                />
              </div>
              <input
                type="number"
                className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                placeholder="Quantity in Stock"
                onChange={(e) =>
                  updateProduct("inStock", Number(e.target.value))
                }
                value={product.inStock as number}
              />
              <select
                className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                onChange={(e) => updateProduct("orderType", e.target.value)}
                value={product.orderType}
              >
                <option value="" disabled>
                  Select Order Type
                </option>
                <option value="home_delivery">Home Delivery</option>
                <option value="office_delivery">Office Delivery</option>
                <option value="pickup">Pickup</option>
                <option value="curbside_pickup">Curbside Pickup</option>
                <option value="same_day_delivery">Same Day Delivery</option>
                <option value="scheduled_delivery">Scheduled Delivery</option>
                <option value="international_shipping">
                  International Shipping
                </option>
              </select>
              <div className="w-full flex justify-between">
                <p className="w-full font-inter font-medium text-[1.6rem] leading-[1.21] text-[#8B8D97]">
                  Discount
                </p>
                <div className="w-full flex gap-[20px] justify-end">
                  <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#83898C]">
                    Add Discount
                  </p>
                  <ToggleButton {...discountToggleProps} />
                </div>
              </div>
              {discountToggle && (
                <div className="w-full flex gap-[12px]">
                  <select
                    className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                    onChange={(e) =>
                      updateProduct("discountDetails", {
                        ...product.discountDetails, // Keep the rest of discountDetails
                        type: e.target.value, // Update only `type`
                      })
                    }
                    value={product.discountDetails?.type}
                  >
                    <option value="" disabled>
                      Type
                    </option>
                    <option value="fixed">Fixed</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                  <input
                    type="number"
                    className="w-full p-[16px] text-[#ABAFB1] font-inter font-normal text-[1.6rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px]"
                    placeholder="Value"
                    onChange={(e) =>
                      updateProduct("discountDetails", {
                        ...product.discountDetails, // Keep the rest of discountDetails
                        amount: e.target.value, // Update only `type`
                      })
                    }
                    value={product.discountDetails?.amount as number}
                  />
                </div>
              )}
              <div className="w-full flex justify-between">
                <p className="w-full font-inter font-medium text-[1.6rem] leading-[1.21] text-[#8B8D97]">
                  Expiry Date
                </p>
                <div className="w-full flex gap-[20px] justify-end">
                  <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#83898C]">
                    Add Expiry Date
                  </p>
                  <ToggleButton {...expiredDateToggleProps} />
                </div>
              </div>
              {expiredDateToggle && (
                <div className="w-full flex gap-[8px]" onClick={handleClick}>
                  <div className="w-full p-[8px_16px] flex justify-between items-center gap-[16px] bg-[#EFF1F999] rounded-[8px]">
                    <LazyImage
                      src={"/newProduct/calendar.svg"}
                      alt={""}
                      className="max-w-[24px] max-h-[24px] w-full h-full"
                    />
                    <div className="w-full">
                      <input
                        ref={dateInputRef}
                        type="date"
                        className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#ABAFB1] bg-transparent py-[8.5px] w-full outline-none"
                        placeholder=""
                        onChange={(e) =>
                          updateProduct("expiryDate", {
                            ...product.expiryDate, // Keep the rest of discountDetails
                            date: e.target.value, // Update only `type`
                          })
                        }
                        value={String(product.expiryDate?.date)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex flex-col gap-[24px]">
              <div className="w-full">
                <textarea
                  name=""
                  id=""
                  placeholder="Short Description"
                  className="w-full bg-[#EFF1F999] p-[16px_2px_2px_16px] outline-none font-inter font-normal text-[1.6rem] leading-[1.21] text-[#ABAFB1] h-[165px] rounded-[8px]"
                  onChange={(e) =>
                    updateProduct("shortDescription", e.target.value)
                  }
                  value={product.shortDescription}
                />
              </div>
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#5E6366]">
                  Product long description
                </p>
                <div className="w-full flex flex-col gap-[4px]">
                  <div className="w-full flex flex-col gap-[16px] bg-[#EFF1F999] p-[8px_2px_2px_8px] outline-none font-inter font-normal text-[1.4rem] leading-[1.21] text-[#ABAFB1] h-[165px] rounded-[8px]">
                    <div className="w-full flex justify-between items-center pr-[8px]">
                      <div className="max-w-[184px] w-full flex gap-[8px]">
                        <div className="w-full">
                          {/* First div as select option for fonts */}
                          <select
                            className="w-full p-[7px_9px] text-[#ABAFB1] font-inter font-normal text-[1rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px] border-[1px] border-[#CFD3D4]"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Font
                            </option>
                            <option value="font-serif">Serif</option>
                            <option value="font-sans">Sans Serif</option>
                            <option value="font-roboto">Roboto</option>
                            <option value="font-cursive">Cursive</option>
                            <option value="font-ubuntu">Ubuntu</option>
                            <option value="font-inter">Inter</option>
                            <option value="font-poppins">Poppins</option>
                          </select>
                        </div>
                        <div className="w-full">
                          {/* Second div as select option for content types */}
                          <select
                            className="w-full p-[7px_9px] text-[#ABAFB1] font-inter font-normal text-[1rem] leading-[1.21] outline-none bg-[#EFF1F999] rounded-[8px] border-[1px] border-[#CFD3D4]"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Point
                            </option>
                            <option value="paragraph">Paragraph</option>
                            <option value="bullets">Bullets</option>
                            <option value="numbered-list">Numbered List</option>
                            <option value="quote">Quote</option>
                            <option value="code">Code Block</option>
                          </select>
                        </div>
                      </div>
                      <div className="max-w-[155px] w-full flex gap-[11.5px] items-center">
                        <div className="w-full flex gap-[8px]">
                          <LazyImage
                            src={"/newProduct/bold.svg"}
                            alt={""}
                            className="max-w-[12px] max-h-[12px] w-full h-full"
                          />
                          <LazyImage
                            src={"/newProduct/underline.svg"}
                            alt={""}
                            className="max-w-[12px] max-h-[12px] w-full h-full"
                          />
                          <LazyImage
                            src={"/newProduct/italic.svg"}
                            alt={""}
                            className="max-w-[12px] max-h-[12px] w-full h-full"
                          />
                        </div>
                        <div className="w-full flex gap-[8px]">
                          <LazyImage
                            src={"/newProduct/align-justify.svg"}
                            alt={""}
                            className="max-w-[16px] max-h-[16px] w-full h-full"
                          />
                          <LazyImage
                            src={"/newProduct/align-left.svg"}
                            alt={""}
                            className="max-w-[16px] max-h-[16px] w-full h-full"
                          />
                          <LazyImage
                            src={"/newProduct/align-right.svg"}
                            alt={""}
                            className="max-w-[16px] max-h-[16px] w-full h-full"
                          />
                        </div>
                        <div className="max-w-[16px] w-full flex gap-[8px]">
                          <LazyImage
                            src={"/newProduct/link-2.svg"}
                            alt={""}
                            className="max-w-[16px] max-h-[16px] w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                    <textarea
                      className="h-full w-full bg-transparent outline-none font-inter font-normal text-[1.6rem] leading-[1.21]"
                      placeholder="Your text goes here"
                      onChange={(e) =>
                        updateProduct("longDescription", e.target.value)
                      }
                      value={product.longDescription}
                    />
                  </div>
                  <p className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#ABAFB1]">
                    Add a long description for your product
                  </p>
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="w-max font-inter font-medium text-[1.6rem] leading-[1.21] text-[#8B8D97]">
                  Return policy
                </p>
                <div className="w-max flex gap-[20px]">
                  <p className="font-inter font-normal text-[1.4rem] leading-[1.21] text-[#83898C]">
                    Add Return Policy
                  </p>
                  <ToggleButton {...returnPolicyToggleProps} />
                </div>
              </div>
              <div className="w-full flex flex-col gap-[8px]">
                <p className="font-inter font-normal text-[1.2rem] leading-[1.21]">
                  Date Added
                </p>
                <div className="w-full flex gap-[8px]">
                  <div className="max-w-[183px] w-full p-[8px_16px] flex justify-between items-center gap-[16px] bg-[#EFF1F999] rounded-[8px]">
                    <LazyImage
                      src={"/newProduct/calendar.svg"}
                      alt={""}
                      className="max-w-[24px] max-h-[24px] w-full h-full"
                    />
                    <div className="w-full">
                      <p className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#ABAFB1]">
                        {new Date().getDate()}/{new Date().getMonth()}/
                        {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                  <div className="max-w-[183px] w-full p-[8px_16px] flex justify-between items-center gap-[16px] bg-[#EFF1F999] rounded-[8px]">
                    <LazyImage
                      src={"/newProduct/clock.svg"}
                      alt={""}
                      className="max-w-[24px] max-h-[24px] w-full h-full"
                    />
                    <div className="w-full">
                      <p className="font-inter font-normal text-[1.6rem] leading-[1.21] text-[#ABAFB1]">
                        {new Date().getHours()}:{new Date().getMinutes()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[410px] w-full bg-[#FFFFFF] rounded-[12px] p-[20px_19px_0px]">
            <div className="w-full flex flex-col gap-[12px]">
              {!imageSrc ? (
                <div
                  className="cursor-pointer w-full p-[74px_16px] bg-[#F4F5FA] border-[1px] border-[#E1E2E9] rounded-[12px] flex flex-col gap-[30px] items-center"
                  onClick={handleImageClick} // Trigger file input on div click
                >
                  {/* Display the uploaded image or the default one */}
                  <LazyImage
                    src={"/newProduct/upload_image.svg"}
                    alt="Upload Image"
                    className="max-w-[56px] max-h-[56px] w-full h-full"
                  />
                  <div className="w-max flex flex-col gap-[13px]">
                    <div className="w-max mx-auto w-full flex gap-[12px]">
                      <LazyImage
                        src={"/newProduct/upload-cloud.svg"}
                        alt="Upload Cloud"
                        className="max-w-[20px] max-h-[20px] w-full h-full"
                      />
                      <p className="font-inter font-medium text-[1.6rem] leading-[1.21] text-center text-[#5570F1]">
                        Upload Image
                      </p>
                    </div>
                    <div className="w-full flex flex-col gap-[4px]">
                      <p className="w-full font-inter font-normal text-[1.4rem] leading-[1.21] text-center text-[#8B8D97]">
                        Upload a cover image for your product.
                      </p>
                      <p className="w-max font-inter font-normal text-[1.2rem] leading-[1.21] text-center text-[#8B8D97]">
                        File Format{" "}
                        <span className="text-[#2C2D33]">jpeg, png</span>{" "}
                        Recommened Size{" "}
                        <span className="text-[#2C2D33]">600x600 (1:1)</span>
                      </p>
                    </div>
                  </div>

                  {/* Hidden file input element */}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div className="w-full h-full relative rounded-[12px]">
                  {/* Main Image */}
                  <LazyImage
                    src={imageSrc}
                    alt=""
                    className="max-w-[372px] w-full max-h-[302px] h-full object-contain border-[1px] border-[#E1E2E9] rounded-[12px]"
                  />

                  {/* Upload Icon (Yellow) */}
                  <div
                    onClick={handleImageClick}
                    className="cursor-pointer absolute top-[40px] right-[80px] transform translate-x-[50%] translate-y-[-50%]"
                  >
                    <LazyImage
                      src={"/newProduct/upload_cloud_yellow.svg"}
                      alt=""
                      className="bg-[#FFF2E2] p-[6px] rounded-[8px]"
                    />
                  </div>

                  {/* Delete Icon */}
                  <div
                    onClick={() => setImageSrc(null)}
                    className="cursor-pointer absolute top-[40px] right-[40px] transform translate-x-[50%] translate-y-[-50%]"
                  >
                    <LazyImage
                      src={"/newProduct/delete.svg"}
                      alt=""
                      className="bg-[#FFF2E2] p-[6px] rounded-[8px]"
                    />
                  </div>
                </div>
              )}
              <p className="font-inter font-medium text-[1.6rem] leading-[1.21] text-[#45464E]">
                Additional Images
              </p>
              <div className="cursor-pointer w-full flex gap-[28px]">
                <div className="w-full basis-1/2 bg-[#F4F5FA] border-[1px] border-[#E1E2E9] p-[41px_17px] rounded-[12px] flex flex-col items-center justify-center gap-[12px]">
                  <LazyImage
                    src={"/newProduct/upload_image.svg"}
                    alt={""}
                    className="max-w-[56px] max-h-[56px] w-full h-full"
                  />
                  <div className="w-full flex gap-[12px] items-center justify-center">
                    <LazyImage
                      src={"/newProduct/upload-cloud.svg"}
                      alt={""}
                      className="max-w-[20px] max-h-[20px] w-full h-full"
                    />
                    <p className="font-inter font-medium text-[1.6rem] leading-[1.21] text-center text-[#5570F1]">
                      Upload Image
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
