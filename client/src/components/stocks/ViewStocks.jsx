import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewStocks = () => {
  // Sample data for 10 stock items
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stocks`);
      setStocks(response.data);
      console.log("my stocks is ", stocks);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  console.log();
  const stockData = [
    {
      itemCode: "001",
      company: "SHIVAM TEXT",
      item: "Shirt",
      description: "Cotton Shirt",
      hsn: "6109",
      gst: 5,
      qty: 100,
      mrp: 500,
      cp: 300,
    },
    {
      itemCode: "002",
      company: "SHIVAM TEXT",
      item: "Trousers",
      description: "Denim Jeans",
      hsn: "6203",
      gst: 12,
      qty: 50,
      mrp: 1500,
      cp: 1200,
    },
    {
      itemCode: "003",
      company: "SHIVAM TEXT",
      item: "T-shirt",
      description: "Polyester T-shirt",
      hsn: "6109",
      gst: 18,
      qty: 200,
      mrp: 400,
      cp: 200,
    },
    {
      itemCode: "004",
      company: "SHIVAM TEXT",
      item: "Jacket",
      description: "Leather Jacket",
      hsn: "4203",
      gst: 18,
      qty: 30,
      mrp: 3000,
      cp: 2500,
    },
    {
      itemCode: "005",
      company: "SHIVAM TEXT",
      item: "Shoes",
      description: "Sports Shoes",
      hsn: "6403",
      gst: 5,
      qty: 80,
      mrp: 2000,
      cp: 1500,
    },
    {
      itemCode: "006",
      company: "Other",
      item: "Hat",
      description: "Cotton Hat",
      hsn: "6505",
      gst: 12,
      qty: 60,
      mrp: 300,
      cp: 150,
    },
    {
      itemCode: "007",
      company: "Other",
      item: "Gloves",
      description: "Woolen Gloves",
      hsn: "6116",
      gst: 5,
      qty: 100,
      mrp: 150,
      cp: 80,
    },
    {
      itemCode: "008",
      company: "Other",
      item: "Scarf",
      description: "Silk Scarf",
      hsn: "6214",
      gst: 5,
      qty: 40,
      mrp: 600,
      cp: 400,
    },
    {
      itemCode: "009",
      company: "Other",
      item: "Belt",
      description: "Leather Belt",
      hsn: "4203",
      gst: 18,
      qty: 70,
      mrp: 1200,
      cp: 800,
    },
    {
      itemCode: "010",
      company: "SHIVAM TEXT",
      item: "Cap",
      description: "Baseball Cap",
      hsn: "6505",
      gst: 5,
      qty: 90,
      mrp: 200,
      cp: 120,
    },
  ];

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
                <td>{stock.company}</td>
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
