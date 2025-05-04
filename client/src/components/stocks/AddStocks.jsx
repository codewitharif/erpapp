import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddStocks = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [stockData, setStockData] = useState([
    {
      itemCode: "",
      companyId: "",
      item: "",
      description: "",
      hsn: "",
      gst: "",
      qty: 0,
      mrp: "",
      cp: "",
    },
  ]);

  const [companies, setCompanies] = useState([]);
  const [allItems, setAllItems] = useState([]); // Store all items fetched from api/stocks
  const [filteredItems, setFilteredItems] = useState([]); // Store filtered items for suggestions

  useEffect(() => {
    axios
      .get(`${API_URL}/api/companies`)
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));

    // Fetch all items for autofill
    axios
      .get(`${API_URL}/api/stocks`)
      .then((response) => setAllItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleItemInputChange = (index, value) => {
    const updatedStockData = [...stockData];
    updatedStockData[index].item = value;
    setStockData(updatedStockData);

    // Filter items based on the input
    const matches = allItems.filter((item) =>
      item.item.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredItems(matches);
  };

  const handleItemSelect = (index, selectedItem) => {
    console.log("our selected item is ", selectedItem);
    const updatedStockData = [...stockData];

    // Find the company matching the selectedItem's companyId
    const matchingCompany = companies.find(
      (company) => company._id === selectedItem.companyId
    );
    const companyId = matchingCompany ? matchingCompany._id : "";

    updatedStockData[index] = {
      ...updatedStockData[index],

      itemCode: selectedItem.itemcode,
      companyId: companyId, // Set the companyId based on the selected item
      item: selectedItem.item,
      description: selectedItem.itemDescription,
      hsn: selectedItem.hsn,
      gst: selectedItem.gstinpercent,
      mrp: selectedItem.mrpinrs,
      cp: selectedItem.cpinrs,
    };
    setStockData(updatedStockData);
    setFilteredItems([]); // Clear suggestions after selecting an item
  };

  const handleChange = (index, field, value) => {
    const updatedStockData = [...stockData];
    updatedStockData[index][field] =
      field === "qty" || field === "gst" || field === "mrp" || field === "cp"
        ? parseFloat(value) || 0
        : value;
    setStockData(updatedStockData);
  };

  const addNewRow = () => {
    setStockData([
      ...stockData,
      {
        itemCode: "",
        companyId: "",
        item: "",
        description: "",
        hsn: "",
        gst: "",
        qty: 0,
        mrp: "",
        cp: "",
      },
    ]);
  };

  const saveStockData = async () => {
    try {
      for (const stock of stockData) {
        await axios.post(`${API_URL}/api/stocks`, {
          itemcode: stock.itemCode,
          companyId: stock.companyId,
          item: stock.item,
          itemDescription: stock.description,
          hsn: stock.hsn,
          gstinpercent: stock.gst,
          qty: stock.qty,
          mrpinrs: stock.mrp,
          cpinrs: stock.cp,
        });
      }
      toast.success("Stock data saved successfully!"); // Show success message
      // alert("Stock data saved successfully!");
    } catch (error) {
      console.error("Error saving stock data:", error);
      alert("Failed to save stock data.");
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <h1 className="text-2xl font-bold mb-4">New Stock</h1>
      <div className="overflow-x-auto">
        <table className="table table-xs overflow-x-auto">
          <thead>
            <tr className="bg-none-200">
              <th className="border p-2">Sr.</th>
              <th className="border p-2">ItemCode</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">Item Description</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">GST(%)</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">MRP(Rs.)</th>
              <th className="border p-2">CP(Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.itemCode}
                    onChange={(e) =>
                      handleChange(index, "itemCode", e.target.value)
                    }
                    className="border w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <select
                    value={stock.companyId}
                    onChange={(e) =>
                      handleChange(index, "companyId", e.target.value)
                    }
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
                </td>
                <td className="border p-2 relative">
                  <input
                    type="text"
                    value={stock.item}
                    onChange={(e) =>
                      handleItemInputChange(index, e.target.value)
                    }
                    className="border w-full p-1"
                  />
                  {filteredItems.length > 0 && (
                    <div className="absolute top-full left-0 bg-white border border-gray-300 w-full z-50">
                      {filteredItems.map((suggestion) => (
                        <div
                          key={suggestion.itemCode}
                          onClick={() => handleItemSelect(index, suggestion)}
                          className="p-1 cursor-pointer hover:bg-gray-100"
                        >
                          {suggestion.item}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    className="border w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.hsn}
                    onChange={(e) => handleChange(index, "hsn", e.target.value)}
                    className="border w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.gst}
                    onChange={(e) => handleChange(index, "gst", e.target.value)}
                    className="border w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.qty}
                    onChange={(e) => handleChange(index, "qty", e.target.value)}
                    className="border w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.mrp}
                    onChange={(e) => handleChange(index, "mrp", e.target.value)}
                    className="border w-full p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={stock.cp}
                    onChange={(e) => handleChange(index, "cp", e.target.value)}
                    className="border w-full p-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={saveStockData}
        >
          SAVE
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={addNewRow}
        >
          NEW
        </button>
      </div>
    </div>
  );
};

export default AddStocks;
