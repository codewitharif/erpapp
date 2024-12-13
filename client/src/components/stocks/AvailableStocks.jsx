import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

const AvailableStocks = () => {
  const [companies, setCompanies] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("-All-");
  const [itemFilter, setItemFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/companies`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch available stocks from API
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/stocks/available`);
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };
    fetchStocks();
  }, []);

  // Create a map for companies for quick access
  const companyMap = companies.reduce((acc, company) => {
    acc[company._id] = company.companyName;
    return acc;
  }, {});

  // Filtering logic
  const filteredData = stockData.filter((stock) => {
    const isCompanyMatch =
      companyFilter === "-All-" ||
      companyMap[stock.companyId] === companyFilter;
    const isItemMatch =
      !itemFilter ||
      stock.item.toLowerCase().includes(itemFilter.toLowerCase());
    return isCompanyMatch && isItemMatch;
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        Available Stock Details
      </h1>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Company */}
        <div className="form-control w-full sm:w-auto">
          <label className="label">Company</label>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="select select-bordered select-sm sm:w-auto"
          >
            <option value="-All-">All Companies</option>
            {companies.map((company) => (
              <option key={company._id} value={company.companyName}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Item */}
        <div className="form-control w-full sm:w-auto">
          <label className="label">Item</label>
          <input
            type="text"
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Search by item"
          />
        </div>

        {/* From Date */}
        <div className="form-control w-full sm:w-auto">
          <label className="label">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>

        {/* To Date */}
        <div className="form-control w-full sm:w-auto">
          <label className="label">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Company</th>
              <th>Item Code</th>
              <th>Item</th>
              <th>HSN Code</th>
              <th>Qty</th>
              <th>GST(%)</th>
              <th>Rate</th>
              <th>MRP</th>
              <th>Total (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((stock, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{companyMap[stock.companyId]}</td>
                  <td>{stock.itemcode}</td>
                  <td>{stock.item}</td>
                  <td>{stock.hsn}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.gstinpercent}</td>
                  <td>{stock.cpinrs}</td>
                  <td>{stock.mrpinrs}</td>
                  <td>{stock.qty * stock.cpinrs}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No data available for the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableStocks;
