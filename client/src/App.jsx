import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Configuration from "./components/configurations/Configuration";
import AddCustomer from "./components/customer/AddCustomer";
import ViewCustomer from "./components/customer/ViewCustomer";
import SendMessage from "./components/customer/SendMessage";
import AddStocks from "./components/stocks/AddStocks";
import ViewStocks from "./components/stocks/ViewStocks";
import EditStocks from "./components/stocks/EditStocks";
import AvailableStocks from "./components/stocks/AvailableStocks";
import SoldStocks from "./components/stocks/SoldStocks";
import AddPurchase from "./components/purchase/AddPurchase";
import ViewPurchase from "./components/purchase/ViewPurchase";
import ViewOrder from "./components/purchase/ViewOrder";
import AddSupplier from "./components/purchase/AddSupplier";
import AddInvoice from "./components/sales/AddInvoice";
import ViewInvoice from "./components/sales/ViewInvoice";
import ViewSales from "./components/sales/ViewSales";
import SaleInfo from "./components/sales/SaleInfo";
import Suppliers from "./components/purchase/Suppliers";
import UpdatePurchase from "./components/purchase/UpdatePurchase";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="config" element={<Configuration />} />
        {/* customer routes */}
        <Route path="addCustomer" element={<AddCustomer />} />
        <Route path="viewCustomer" element={<ViewCustomer />} />
        <Route path="sendMessage" element={<SendMessage />} />
        {/* stocks routes */}
        <Route path="addStocks" element={<AddStocks />} />
        <Route path="viewStocks" element={<ViewStocks />} />
        <Route path="editStocks" element={<EditStocks />} />
        <Route path="availableStocks" element={<AvailableStocks />} />
        <Route path="soldStocks" element={<SoldStocks />} />
        {/* purchase routes */}
        <Route path="addPurchase" element={<AddPurchase />} />
        <Route path="viewPurchase" element={<ViewPurchase />} />
        <Route path="addSupplier" element={<Suppliers />} />
        <Route path="viewOrder" element={<ViewOrder />} />
        <Route path="updatePurchase/:purchaseId" element={<UpdatePurchase />} />
        {/* sale routes */}
        <Route path="addInvoice" element={<AddInvoice />} />
        <Route path="viewInvoice" element={<ViewInvoice />} />
        <Route path="viewSales" element={<ViewSales />} />
        <Route path="saleInfo" element={<SaleInfo />} />
      </Routes>
    </>
  );
};

export default App;
