import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing search icon from react-icons

const SoldStocks = () => {
  const [company, setCompany] = useState("-All-");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Handler for search button click
  const handleSearch = () => {
    console.log("Search initiated");
    // Implement your search functionality here
  };

  return (
    <div className="container mx-auto mt-6">
      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Select Company Dropdown */}
        <div className="form-control w-full sm:w-auto">
          <label className="label font-medium">Select Company:</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="select select-bordered select-sm  "
          >
            <option value="-All-">-All-</option>
            <option value="FILA">FILA</option>
            <option value="ADIDAS">ADIDAS</option>
            <option value="REEBOK">REEBOK</option>
            <option value="HP">HP</option>
            <option value="GRASSIM">GRASSIM</option>
            <option value="LEVIS">LEVIS</option>
            <option value="GM">GM</option>
          </select>
        </div>

        {/* From Date Field */}
        <div className="form-control w-full sm:w-auto">
          <label className="label font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>

        {/* To Date Field */}
        <div className="form-control w-full sm:w-auto">
          <label className="label font-medium">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Today's Sold Stock:</h2>
      </div>
    </div>
  );
};

export default SoldStocks;
