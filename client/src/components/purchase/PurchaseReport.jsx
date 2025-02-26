import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const PurchaseReport = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [summaryData, setSummaryData] = useState(null); // Store all fetched data
  const [from, setFrom] = useState(""); // Filter start date
  const [to, setTo] = useState(""); // Filter end date

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/purchases/summary`, {
        params: {
          from,
          to,
        },
      });
      setSummaryData(response.data.summary);
    } catch (error) {
      console.error("Error fetching purchase summary:", error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, [from, to]); // Refetch data when filters change

  console.log("my total purchase is ", summaryData);
  return (
    <div className="p-4">
      {/* Header */}
      <h2 className="text-lg font-bold mb-4">Purchase Report Summary</h2>

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label htmlFor="from-date" className="label-text">
            From:
          </label>
          <input
            type="date"
            id="from-date"
            className="input input-bordered input-sm w-full sm:w-36"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="form-control w-full sm:w-auto">
          <label htmlFor="to-date" className="label-text">
            To:
          </label>
          <input
            type="date"
            id="to-date"
            className="input input-bordered input-sm w-full sm:w-36"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button
          onClick={fetchSummaryData}
          className="btn btn-primary btn-sm w-full sm:w-auto"
        >
          <FaSearch />
        </button>
      </div>

      {/* Monthly Summary Title */}
      <h3 className="text-lg font-semibold mb-4">
        Purchase/Receipt for this month Oct 2024
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchase Summary - Left Section */}
        <div className="bg-base-100 p-4 rounded-md shadow">
          <h4 className="text-xl font-semibold mb-2">Purchase</h4>
          <div className="flex justify-between py-1">
            <span>Purchase :</span>
            <span>{summaryData?.totalAmount}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>GST Charged :</span>
            <span>{summaryData?.totalGst}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Other Charges :</span>
            <span>{summaryData?.otherCharges}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between py-1 font-semibold">
            <span>Total Purchase Value : </span>
            <span>{summaryData?.netTotal}</span>
          </div>
        </div>

        {/* Receipt Summary - Right Section */}
        <div className="bg-base-100 p-4 rounded-md shadow">
          <h4 className="text-xl font-semibold mb-2 text-right">Receipt</h4>
          <div className="flex justify-between py-1">
            <span>Cash Transaction :</span>
            <span>{summaryData?.cashPaid}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Bank Transfer :</span>
            <span>{summaryData?.cardPaid}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Purchase Return :</span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReport;
