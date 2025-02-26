import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [salesSummaryData, setSalesSummaryData] = useState(null); // Store all fetched data
  const [purchaseSummaryData, setPurchaseSummaryData] = useState(null); // Store all fetched data

  const fetchSummaryData = () => {
    axios
      .get(`${API_URL}/api/sales/summary-for-home`)
      .then((response) => setSalesSummaryData(response.data.summary))
      .catch((error) => console.log("Error fetching sales summary:", error));
    axios
      .get(`${API_URL}/api/purchases/summary-for-home`)
      .then((response) => setPurchaseSummaryData(response.data.summary))
      .catch((error) => console.log("Error fetching purchase summary:", error));
  };

  useEffect(() => {
    fetchSummaryData();
  }, []); // Refetch data when filters change

  console.log("my sale summary is ", salesSummaryData);
  console.log("getting sales summary ", salesSummaryData);
  console.log("getting purchase summary ", purchaseSummaryData);
  return (
    <div className="p-4 flex flex-col md:flex-row gap-6">
      {/* Left Side: Quick Links */}
      <div className="flex-1 w-full md:w-1/3  p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/addStocks"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            Add Stock
          </Link>
          <Link
            to="/addPurchase"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            New Purchase
          </Link>
          <Link
            to="/addInvoice"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            New Invoice
          </Link>

          <Link
            to="/addSupplier"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            Add Supplier
          </Link>
          <Link
            to="/addCustomer"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            Add Customer
          </Link>
          <Link
            to="/editStocks"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            Edit Stocks
          </Link>
          <Link
            to="/config"
            className="btn btn-outline btn-neutral rounded-md w-full"
          >
            Configurations
          </Link>
        </div>
      </div>

      {/* Right Side: Alerts */}
      <div className="w-full md:w-1/3  p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Alerts!!</h2>

        {/* Today's Sale Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Today's Sale
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Cash Sale (Rs.):</span>{" "}
              <span>{salesSummaryData?.cashReceived}</span>
            </div>
            <div className="flex justify-between">
              <span>Card/UPI (Rs.):</span>{" "}
              <span>{salesSummaryData?.cardReceived}</span>
            </div>
            {/* <div className="flex justify-between"> 
               <span>Cheque Sale (Rs.):</span> <span>0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Credit Sale (Rs.):</span> <span>0.00</span>
            </div> */}
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total Sale (Rs.):</span>{" "}
              <span>{salesSummaryData?.totalNetRate}</span>
            </div>
          </div>
        </div>

        {/* SMS Balance Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Today's Purchase
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>GST:</span> <span>{purchaseSummaryData?.totalGst}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Purchases:</span>{" "}
              <span className="text-blue-600">
                {purchaseSummaryData?.netTotal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
