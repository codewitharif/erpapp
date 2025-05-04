import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddPurchase = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transports, setTransports] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // States for form fields
  const [supplierId, setSupplierId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [billNo, setBillNo] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [netTotal, setNetTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [cash, setCash] = useState(0);
  const [card, setCard] = useState(0);
  const [cheque, setCheque] = useState(0);
  const [chequeNo, setChequeNo] = useState("");
  const [bankId, setBankId] = useState("");
  const [transportId, setTransportId] = useState("");
  const [remark, setRemark] = useState("");

  // States for sold item fields
  const [companyId, setCompanyId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [hsn, setHsn] = useState("");
  const [rate, setRate] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountRs, setDiscountRs] = useState(0);
  const [netRate, setNetRate] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [gstPercent, setGstPercent] = useState(0);
  const [gst, setGst] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [total, setTotal] = useState(0);

  // Items array to hold individual item objects
  const [items, setItems] = useState([]);

  // Autofill for suggestion states
  const [allItems, setAllItems] = useState([]); // Store all items fetched from api/stocks
  const [filteredItems, setFilteredItems] = useState([]); // Store filtered items for suggestions

  // State to track the item being edited
  const [editIndex, setEditIndex] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/companies`)
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));

    axios
      .get(`${API_URL}/api/suppliers`)
      .then((response) => setSuppliers(response.data.suppliers))
      .catch((error) => console.error("Error fetching suppliers:", error));

    axios
      .get(`${API_URL}/api/bankAccounts`)
      .then((response) => setBankAccounts(response.data))
      .catch((error) => console.error("Error fetching bank accounts:", error));

    axios
      .get(`${API_URL}/api/transports`)
      .then((response) => setTransports(response.data))
      .catch((error) => console.error("Error fetching transports:", error));

    axios
      .get(`${API_URL}/api/stocks`)
      .then((response) => setAllItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  // Calculate item fields when rate, discountPercent, gstPercent, or quantity changes
  useEffect(() => {
    const discountRsValue = (Number(rate) * Number(discountPercent)) / 100;
    const netRateValue = Number(rate) - discountRsValue;
    const gstValue = ((netRateValue * Number(gstPercent)) / 100) * quantity;
    const totalValue = netRateValue * quantity + gstValue;

    setDiscountRs(discountRsValue);
    setNetRate(netRateValue);
    setGst(gstValue);
    setTotal(totalValue);
  }, [rate, discountPercent, gstPercent, quantity]);

  // Calculate summary when items, otherCharges, or discount changes
  useEffect(() => {
    calculateSummary();
  }, [items, otherCharges, discount]);

  // Calculate balance when netTotal, cash, card, or cheque changes
  useEffect(() => {
    const newBalance = netTotal - (cash + card + cheque);
    setBalance(newBalance);
  }, [netTotal, cash, card, cheque]);

  // Handle supplier input change and filter suggestions
  const handleSupplierChange = (e) => {
    const input = e.target.value;
    setSupplierName(input);

    if (input) {
      const matches = suppliers.filter((supplier) =>
        supplier.supplierName.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredSuppliers(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Select a supplier from suggestions
  const selectSupplier = (supplier) => {
    setSupplierName(supplier.supplierName);
    setSupplierId(supplier._id);
    setShowSuggestions(false);
  };

  // Calculate summary totals
  const calculateSummary = () => {
    const totalAmount = items.reduce(
      (acc, item) => acc + item.netRate * item.quantity,
      0
    );
    const gstTotal = items.reduce((acc, item) => acc + item.gstAmount, 0);
    const netTotal =
      totalAmount + gstTotal + Number(otherCharges) - Number(discount);

    setTotalAmount(totalAmount);
    setGstTotal(gstTotal);
    setNetTotal(netTotal);
  };

  // Add an item to the items array
  const addItem = () => {
    const newItem = {
      companyId,
      itemCode,
      itemName,
      hsn,
      rate,
      discountPercent,
      discountAmount: discountRs,
      netRate,
      quantity,
      gstPercent,
      gstAmount: gst,
      mrp,
      totalAmount: total,
    };

    if (editIndex !== null) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
      setEditIndex(null); // Reset edit mode
    } else {
      // Add new item
      setItems((prevItems) => [...prevItems, newItem]);
    }

    // Reset form fields
    setCompanyId("");
    setItemCode("");
    setItemName("");
    setHsn("");
    setRate(0);
    setDiscountPercent(0);
    setQuantity(1);
    setGstPercent(0);
    setMrp(0);
  };

  // Handle edit item
  const handleEdit = (index) => {
    const item = items[index];
    setCompanyId(item.companyId);
    setItemCode(item.itemCode);
    setItemName(item.itemName);
    setHsn(item.hsn);
    setRate(item.rate);
    setDiscountPercent(item.discountPercent);
    setQuantity(item.quantity);
    setGstPercent(item.gstPercent);
    setMrp(item.mrp);
    setEditIndex(index); // Set the index of the item being edited
  };

  // Handle delete item
  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const purchaseData = {
      supplierId,
      purchaseDate,
      billNo,
      totalAmount,
      gstTotal,
      otherCharges,
      discount,
      netTotal,
      balance,
      cash,
      card,
      cheque,
      chequeNo,
      bankId,
      transportId,
      remark,
      items,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/purchases`,
        purchaseData
      );
      toast.success("Purchase saved successfully!"); // Show success message
      console.log("Purchase saved successfully:", response.data);
    } catch (error) {
      toast.error("Error saving purchase!"); // Show error message
      console.error("Error saving purchase:", error);
    }
  };

  // Handle item input change for autofill suggestions
  const handleItemInputChange = (value) => {
    setItemName(value);
    const matches = allItems.filter((item) =>
      item.item.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredItems(matches);
  };

  // Handle item selection from autofill suggestions
  const handleItemSelect = (selectedItem) => {
    setCompanyId(selectedItem.companyId);
    setItemCode(selectedItem.itemcode);
    setItemName(selectedItem.item);
    setHsn(selectedItem.hsn);
    setRate(selectedItem.rate);
    setGstPercent(selectedItem.gstPercent);
    setMrp(selectedItem.mrpinrs);
    setFilteredItems([]); // Clear suggestions after selecting an item
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <h1 className="text-2xl font-bold mb-4">New Purchase</h1>
      {/* Supplier Information */}
      <h3 className="text-lg font-semibold mb-2">Supplier</h3>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="form-control w-full sm:w-48 relative">
            <label className="label">Supplier Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={supplierName}
              onChange={handleSupplierChange}
              onFocus={() => setShowSuggestions(!!supplierName)}
              className="input input-bordered input-sm"
            />
            {showSuggestions && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-50">
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <li
                      key={supplier._id}
                      onClick={() => selectSupplier(supplier)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {supplier.supplierName}
                    </li>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No results found
                  </div>
                )}
              </ul>
            )}
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Purchase Date</label>
            <input
              type="date"
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Bill No.</label>
            <input
              type="text"
              placeholder="Enter Bill No."
              className="input input-bordered input-sm"
              onChange={(e) => setBillNo(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Sold Items */}
      <h3 className="text-lg font-semibold mb-2">Sold Items</h3>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="form-control w-full sm:w-32">
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="select select-bordered select-xs"
            >
              <option value="-All-">-Company-</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="Item Code"
              className="input input-bordered input-xs"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-40 relative">
            <input
              type="text"
              placeholder="Item"
              className="input input-bordered input-xs"
              value={itemName}
              onChange={(e) => {
                handleItemInputChange(e.target.value);
                setItemName(e.target.value);
              }}
            />
            {filteredItems.length > 0 && (
              <ul className="absolute top-full left-0 bg-white border border-gray-300 w-full z-10">
                {filteredItems.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => handleItemSelect(suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {`${suggestion.item}/${suggestion.mrpinrs}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-control w-full sm:w-28">
            <input
              type="text"
              placeholder="HSN"
              className="input input-bordered input-xs"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Rate (Rs.)"
              className="input input-bordered input-xs"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Dis(%)"
              className="input input-bordered input-xs"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Dis (Rs.)"
              className="input input-bordered input-xs"
              value={discountRs}
              onChange={(e) => setDiscountRs(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="Net Rate"
              className="input input-bordered input-xs"
              value={netRate}
              onChange={(e) => setNetRate(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-20">
            <input
              type="number"
              placeholder="Qty"
              className="input input-bordered input-xs"
              defaultValue="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-control w-full sm:w-20">
            <input
              type="text"
              placeholder="GST(%)"
              className="input input-bordered input-xs"
              value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)}
            />
          </div>
          <div className="form-control w-full sm:w-20">
            <input
              type="text"
              placeholder="MRP"
              className="input input-bordered input-xs"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
            />
          </div>
          <button onClick={addItem} className="btn btn-info btn-xs">
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Particular</th>
                <th>HSN</th>
                <th>Rate</th>
                <th>Dis(%)</th>
                <th>Dis (Rs.)</th>
                <th>Net Rate</th>
                <th>GST(%)</th>
                <th>GST (Rs.)</th>
                <th>Qty</th>
                <th>Total (Rs.)</th>
                <th>MRP</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.hsn}</td>
                  <td>{item.rate}</td>
                  <td>{item.discountPercent}</td>
                  <td>{item.discountAmount || 0}</td>
                  <td>{item.netRate}</td>
                  <td>{item.gstPercent}</td>
                  <td>{item.gstAmount}</td>
                  <td>{item.quantity}</td>
                  <td>{item.totalAmount}</td>
                  <td>{item.mrp}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(index)}
                      className="btn btn-xs btn-warning mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Amount Summary */}
      <h3 className="text-lg font-semibold mb-2">Amount Summary</h3>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {/* Left section for Amount Summary fields */}
          <div className="flex-1 border border-gray-300 p-4 rounded">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="form-control w-full lg:w-32">
                <label className="label">Total (Rs.)</label>
                <input
                  type="text"
                  placeholder="Total"
                  value={totalAmount}
                  className="input input-bordered input-sm"
                  readOnly
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">GST Total</label>
                <input
                  type="text"
                  placeholder="GST Total"
                  value={gstTotal}
                  className="input input-bordered input-sm"
                  readOnly
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Other (Rs.)</label>
                <input
                  type="text"
                  placeholder="Other"
                  className="input input-bordered input-sm"
                  onChange={(e) => setOtherCharges(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">-Discount (Rs.)</label>
                <input
                  type="text"
                  placeholder="Discount"
                  className="input input-bordered input-sm"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-48">
                <label className="label">Net Total</label>
                <input
                  type="text"
                  placeholder="Net Total"
                  value={netTotal}
                  className="input input-bordered bg-gray-100 input-sm"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="form-control w-full lg:w-32">
                <label className="label">Cash (Rs.)</label>
                <input
                  type="text"
                  placeholder="Cash"
                  className="input input-bordered input-sm"
                  onChange={(e) => setCash(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Card (Rs.)</label>
                <input
                  type="text"
                  placeholder="Card"
                  className="input input-bordered input-sm"
                  onChange={(e) => setCard(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Cheque (Rs.)</label>
                <input
                  type="text"
                  placeholder="Cheque Rs."
                  className="input input-bordered input-sm"
                  onChange={(e) => setCheque(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Cheque No.</label>
                <input
                  type="text"
                  placeholder="Cheque No."
                  className="input input-bordered input-sm"
                  onChange={(e) => setChequeNo(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Bank</label>
                <select
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  className="select select-bordered select-sm"
                >
                  <option value="-All-">-Select-</option>
                  {bankAccounts.map((bank) => (
                    <option key={bank._id} value={bank._id}>
                      {bank.bankName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Balance (Rs.)</label>
                <input
                  type="text"
                  placeholder="Balance"
                  value={balance}
                  className="input input-bordered input-sm"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Right section for Transport, Remark, and Save Button */}
          <div className="w-full lg:w-1/4 flex flex-col items-end border border-gray-300 p-4 rounded">
            <div className="form-control w-full lg:w-48 mb-4">
              <label className="label">Transport</label>
              <select
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="-All-">-Select-</option>
                {transports.map((transport) => (
                  <option key={transport._id} value={transport._id}>
                    {transport.transporter}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full lg:w-48 mb-4">
              <label className="label">Remark</label>
              <input
                type="text"
                placeholder="Remark"
                className="input input-bordered input-sm"
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <div className="flex items-center"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
          Save
        </button>
        <button className="btn btn-secondary btn-sm">Print</button>
      </div>
    </div>
  );
};

export default AddPurchase;
