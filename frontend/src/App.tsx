import React, { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/navBar/NavBar";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Category from "./components/mainComponents/Category";
import Bag from "./components/mainComponents/Bag";
import TwoUser from "./components/mainComponents/TwoUser";
import Folder from "./components/mainComponents/Folder";
import Chat from "./components/mainComponents/Chat";
import Settings from "./components/mainComponents/Settings";
import NewProduct from "./components/newProductComponents/NewProduct";
import ViewProduct from "./components/viewComponents/ViewProduct";
import {
  FolderPropsType,
  GetTotalProductsType,
  InventoryItemsPropsType,
  InventorySummaryPropsType,
  NavBarPropsType,
} from "./utils/frontEndTypes";

function App(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number | null>(3);
  const [productsData, setProductsData] = useState<InventoryItemsPropsType>({
    allProducts: [],
    columnNames: [],
  });
  const [inventorySummary, setInventorySummary] =
    useState<InventorySummaryPropsType>({
      activeProducts: 0,
      allProducts: 0,
      expiredProducts: 0,
      activeProductsPercentage: 0,
    });

  const navBarProps: NavBarPropsType = {
    currentIndex,
    setCurrentIndex,
  };

  useEffect(() => {
    const getTotalProducts = async () => {
      try {
        const { data } = await axios.get<GetTotalProductsType>(
          `${process.env.REACT_APP_URL}/products`
        );
        const {
          allProducts,
          columnNames,
          totalRows,
          activeProductsCount,
          activeProductsPercentage,
          inActiveProductsCount,
        } = data;

        setProductsData({ allProducts: allProducts, columnNames });
        setInventorySummary({
          activeProducts: activeProductsCount,
          allProducts: totalRows,
          expiredProducts: inActiveProductsCount,
          activeProductsPercentage,
        });
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    getTotalProducts();
  }, []);

  const folderProps: FolderPropsType = {
    productsData,
    inventorySummary,
  };

  const renderComponent = (): React.JSX.Element | null => {
    if (currentIndex === 0) return <Category />;
    if (currentIndex === 1) return <Bag />;
    if (currentIndex === 2) return <TwoUser />;
    if (currentIndex === 3) return <Folder {...folderProps} />;
    if (currentIndex === 4) return <Chat />;
    if (currentIndex === 5) return <Settings />;
    else return null;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-[1440px] w-full mx-auto flex overflow-x-hidden">
              <div className="max-w-[88px] w-full">
                <NavBar {...navBarProps} />
              </div>
              <div className="max-w-[1352px] w-full">{renderComponent()}</div>
            </div>
          }
        />
        <Route
          path="/new-product"
          element={
            <div className="max-w-[1440px] w-full mx-auto flex overflow-x-hidden">
              <div className="max-w-[88px] w-full">
                <NavBar {...navBarProps} />
              </div>
              <div className="max-w-[1352px] w-full min-h-screen">
                <NewProduct />
              </div>
            </div>
          }
        />
        <Route
          path="/:id/view-product"
          element={
            <div className="max-w-[1440px] w-full mx-auto flex overflow-x-hidden">
              <div className="max-w-[88px] w-full">
                <NavBar {...navBarProps} />
              </div>
              <div className="max-w-[1352px] w-full min-h-screen">
                <ViewProduct {...productsData} />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
