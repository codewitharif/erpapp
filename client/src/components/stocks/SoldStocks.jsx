import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const SoldStocks = () => {
  const [company, setCompany] = useState("-All-");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [soldItems, setSoldItems] = useState([]);

  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sales`);
      const allSales = response.data.sales;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter sales for today
      const todaySales = allSales.filter((sale) => {
        const saleDate = new Date(sale.saleDate).toISOString().split("T")[0];
        return saleDate === today;
      });

      // Flatten all sold items
      const allSoldItems = todaySales.flatMap((sale) => sale.soldItemsId.items);

      setSoldItems(allSoldItems);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales data");
    }
  };

  // (Optional) Filter based on selected company
  const filteredItems = soldItems.filter((item) => {
    if (company === "-All-") return true;
    return item.companyName === company; // You need to have `companyName` info in item, else ignore this for now
  });

  return (
    <div className="container mx-auto mt-6">
      <Toaster position="top-center" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="label font-medium">Select Company:</label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="-All-">-All-</option>
            <option value="FILA">FILA</option>
            <option value="ADIDAS">ADIDAS</option>
          </select>
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="label font-medium">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input input-bordered input-sm"
          />
        </div>

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
        <h2 className="text-2xl font-semibold mb-4">Today's Sold Stock:</h2>

        {/* DaisyUI Table */}
        <div className="overflow-x-auto">
          <table className="table table-xs ">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>HSN</th>
                <th>Rate</th>
                <th>Discount %</th>
                <th>Discount Amt</th>
                <th>Net Rate</th>
                <th>GST %</th>
                <th>GST Amt</th>
                <th>Qty</th>
                <th>Total Amt</th>
                <th>UOM</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.itemName}</td>
                    <td>{item.hsn}</td>
                    <td>₹{item.rate}</td>
                    <td>{item.discountPercent}%</td>
                    <td>₹{item.discountAmount}</td>
                    <td>₹{item.netRate}</td>
                    <td>{item.gstPercent}%</td>
                    <td>₹{item.gstAmount}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.totalAmount}</td>
                    <td>{item.uom}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center">
                    No sales for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SoldStocks;
