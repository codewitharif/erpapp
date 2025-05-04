import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewStocks = () => {
  // Sample data for 10 stock items
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [stocks, setStocks] = useState([]);
  const [companies, setCompanies] = useState([]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stocks`);
      setStocks(response.data);
      console.log("my stocks is ", stocks);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/companies`);
      setCompanies(response.data);
      console.log("my companies is ", companies);
    } catch (error) {
      console.log("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchCompanies();
  }, []);

  // Helper function to find company name by ID
  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.companyName : "Unknown Company";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View Stocks</h1>

      <div className="overflow-x-auto">
        <table className="table w-full table-xs">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>ItemCode</th>
              <th>Company</th>
              <th>Item</th>
              <th>Item Description</th>
              <th>HSN</th>
              <th>GST(%)</th>
              <th>Qty</th>
              <th>MRP(Rs.)</th>
              <th>CP(Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.itemcode}</td>
                <td>{getCompanyName(stock.companyId)}</td>
                <td>{stock.item}</td>
                <td>{stock.itemDescription}</td>
                <td>{stock.hsn}</td>
                <td>{stock.gstinpercent}%</td>
                <td>{stock.qty}</td>
                <td>₹{stock.mrpinrs}</td>
                <td>₹{stock.cpinrs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewStocks;
