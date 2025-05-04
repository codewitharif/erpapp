import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const EditStocks = () => {
  const [companies, setCompanies] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("-All-");
  const [itemFilter, setItemFilter] = useState("");
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [editableData, setEditableData] = useState({});
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

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
        console.error("Error fetching suoolier:", error);
      }
    };
    fetchStocks();
  }, []);

  // Create a map for companies for quick access
  const companyMap = companies.reduce((acc, company) => {
    acc[company._id] = company.companyName;
    return acc;
  }, {});

  // Filter stocks based on company and item filters
  const filteredData = stockData.filter((stock) => {
    const isCompanyMatch =
      companyFilter === "-All-" ||
      companyMap[stock.companyId] === companyFilter;
    const isItemMatch =
      !itemFilter ||
      stock.item.toLowerCase().includes(itemFilter.toLowerCase());
    return isCompanyMatch && isItemMatch;
  });

  // Update suggested items when item filter changes
  const handleItemFilterChange = (e) => {
    const inputValue = e.target.value;
    setItemFilter(inputValue);

    // Show suggestions that start with the entered text
    if (inputValue.length > 0) {
      const matchingItems = stockData
        .filter((stock) =>
          stock.item.toLowerCase().startsWith(inputValue.toLowerCase())
        )
        .map((stock) => stock.item);

      setSuggestedItems(matchingItems);
    } else {
      setSuggestedItems([]); // Clear suggestions if input is empty
    }
  };

  const handleEditClick = (id) => {
    setEditingRow(id);
    const stockItem = stockData.find((item) => item._id === id);
    setEditableData({ ...stockItem });
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${API_URL}/api/stocks/${editingRow}`, editableData);
      const updatedStockData = stockData.map((item) =>
        item._id === editingRow ? editableData : item
      );
      // Update the stockData state with the modified data
      setStockData(updatedStockData);
      toast.success("Stock updated successfully!"); // Show success message
      setEditingRow(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating stock data:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditableData({});
  };

  const handleDeleteClick = (id) => {
    const filteredStockData = stockData.filter((item) => item.id !== id);
    setStockData(filteredStockData);
    toast.success("Stock deleted successfully!"); // Show success message
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <h1 className="text-2xl font-bold mb-4">Edit Stocks</h1>
      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
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
        <div className="form-control w-full sm:w-auto relative">
          <label className="label">Item</label>
          <input
            type="text"
            value={itemFilter}
            onChange={handleItemFilterChange}
            className="input input-bordered input-sm"
            placeholder="Search by item"
          />
          {/* Suggestions dropdown */}
          {suggestedItems.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-50">
              {suggestedItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setItemFilter(item);
                    setSuggestedItems([]); // Clear suggestions after selection
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-200 text-xs"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((stock, index) => (
              <tr key={stock._id}>
                {/* (Table content remains the same) */}

                <td>{index + 1}</td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="text"
                      name="itemcode"
                      value={editableData.itemcode}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-24" // Smaller field for itemCode
                    />
                  ) : (
                    stock.itemcode
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <select
                      name="companyId"
                      value={editableData.companyId || stock.companyId}
                      onChange={handleChange}
                      className="border w-full p-1"
                    >
                      <option value="">-select-</option>
                      {Array.isArray(companies) &&
                        companies.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.companyName}
                          </option>
                        ))}
                    </select>
                  ) : (
                    companyMap[stock.companyId]
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="text"
                      name="item"
                      value={editableData.item}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-32"
                    />
                  ) : (
                    stock.item
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="text"
                      name="itemDescription"
                      value={editableData.itemDescription}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-40" // Wider field for descriptions
                    />
                  ) : (
                    stock.itemDescription
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="text"
                      name="hsn"
                      value={editableData.hsn}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-20" // Small field for HSN
                    />
                  ) : (
                    stock.hsn
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="number"
                      name="gstinpercent"
                      value={editableData.gstinpercent}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-16" // Smaller field for numbers
                    />
                  ) : (
                    `${stock.gstinpercent}%`
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="number"
                      name="qty"
                      value={editableData.qty}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-16" // Smaller field for qty
                    />
                  ) : (
                    stock.qty
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="number"
                      name="mrpinrs"
                      value={editableData.mrpinrs}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-20"
                    />
                  ) : (
                    `₹${stock.mrpinrs}`
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <input
                      type="number"
                      name="cpinrs"
                      value={editableData.cpinrs}
                      onChange={handleChange}
                      className="input input-bordered input-xs w-20"
                    />
                  ) : (
                    `₹${stock.cpinrs}`
                  )}
                </td>
                <td>
                  {editingRow === stock._id ? (
                    <>
                      <button
                        className="btn btn-success btn-xs mr-2"
                        onClick={handleSaveClick}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={handleCancelClick}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-xs mr-2"
                        onClick={() => handleEditClick(stock._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDeleteClick(stock._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditStocks;
