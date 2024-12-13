import React from "react";
import { FaSearch } from "react-icons/fa";
const ViewSales = () => {
  return (
    <div className="p-4">
      {/* Header */}
      <h2 className="text-lg font-bold mb-4">Sale/Purchase/Receipt Summary</h2>

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
          />
        </div>

        <button className="btn btn-primary btn-sm w-full sm:w-auto">
          <FaSearch />
        </button>
      </div>

      {/* Monthly Summary Title */}
      <h3 className="text-lg font-semibold mb-4">
        Sale/Purchase/Receipt for this month Oct 2024
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Summary - Left Section */}
        <div className="bg-base-100 p-4 rounded-md shadow">
          <h4 className="text-xl font-semibold mb-2">Sale</h4>
          <div className="flex justify-between py-1">
            <span>Challan :</span>
            <span>3600.00</span>
          </div>
          <div className="flex justify-between py-1">
            <span>GST Invoice :</span>
            <span>9750.00</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between py-1 font-semibold">
            <span>Total Sale :</span>
            <span>13350.00</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Purchases :</span>
            <span>18200.00</span>
          </div>
        </div>

        {/* Receipt Summary - Right Section */}
        <div className="bg-base-100 p-4 rounded-md shadow">
          <h4 className="text-xl font-semibold mb-2 text-right">Receipt</h4>
          <div className="flex justify-between py-1">
            <span>Cash Receipt :</span>
            <span>6000.00</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Bank Receipt :</span>
            <span>3000.00</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Sale Return :</span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSales;
