import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdatePurchase = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;
  const { purchaseId } = useParams();

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
  const [purchaseItemsId, setPurchaseItemsId] = useState("");

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

  // Item suggestions
  const [itemSuggestions, setItemSuggestions] = useState([]);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);

  // Fetch purchase data
  const fetchPurchase = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/purchases/${purchaseId}`
      );
      const data = response.data.purchase;

      setSupplierId(data.supplierId);
      const supplier = suppliers.find((s) => s._id === data.supplierId);
      setSupplierName(supplier ? supplier.supplierName : "Unknown Supplier");

      const formattedDate = new Date(data.purchaseDate)
        .toISOString()
        .split("T")[0];
      setPurchaseDate(formattedDate);

      setBillNo(data.billNo);
      setBankId(data.bankId);
      setGstTotal(data.gstTotal);
      console.log("my total amount is this ", data.totalAmount);
      setTotalAmount(data.totalAmount || 0);
      setOtherCharges(data.otherCharges || 0);
      setDiscount(data.discount || 0);
      setNetTotal(data.netTotal || 0);
      setCash(data.cash || 0);
      setCard(data.card || 0);
      setCheque(data.cheque || 0);
      setChequeNo(data.chequeNo || "");
      setTransportId(data.transportId || "");
      setRemark(data.remark || "");
      setPurchaseItemsId(data.purchaseItemsId._id);

      setItems(data.purchaseItemsId.items);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  };

  // Fetch initial data
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
  }, []);

  // Fetch purchase data when suppliers are loaded
  useEffect(() => {
    if (suppliers.length > 0) {
      fetchPurchase();
    }
  }, [suppliers]);

  // Handle supplier name change
  const handleSupplierChange = (e) => {
    const input = e.target.value;
    setSupplierName(input);

    if (input) {
      const matches = suppliers.filter((supplier) =>
        supplier.supplierName.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuppliers(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Select supplier
  const selectSupplier = (supplier) => {
    setSupplierName(supplier.supplierName);
    setSupplierId(supplier._id);
    setShowSuggestions(false);
  };

  // Handle item name change
  const handleItemNameChange = (e) => {
    const input = e.target.value;
    setItemName(input);

    if (input) {
      const matches = items.filter((item) =>
        item.itemName.toLowerCase().includes(input.toLowerCase())
      );
      setItemSuggestions(matches);
      setShowItemSuggestions(true);
    } else {
      setShowItemSuggestions(false);
    }
  };

  // Select item
  const selectItem = (item) => {
    setItemName(item.itemName);
    setItemCode(item.itemCode);
    setHsn(item.hsn);
    setRate(item.rate);
    setDiscountPercent(item.discountPercent);
    setGstPercent(item.gstPercent);
    setMrp(item.mrp);
    setShowItemSuggestions(false);
  };

  // Recalculate item totals
  useEffect(() => {
    const discountRsValue = (Number(rate) * Number(discountPercent)) / 100;
    const netRateValue = Number(rate) - discountRsValue;
    const gstValue =
      ((netRateValue * Number(gstPercent)) / 100) * Number(quantity);
    const totalValue = netRateValue * Number(quantity) + gstValue;
    setDiscountRs(discountRsValue);
    setNetRate(netRateValue);
    setGst(gstValue);
    setTotal(totalValue);
  }, [rate, discountPercent, gstPercent, quantity]);

  // Recalculate overall totals
  useEffect(() => {
    const recalculatedTotal = items.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );
    const recalculatedGstTotal = items.reduce(
      (acc, item) => acc + item.gstAmount,
      0
    );
    const recalculatedNetTotal =
      recalculatedTotal + Number(otherCharges) - Number(discount);
    const recalculatedBalance =
      recalculatedNetTotal - (Number(cash) + Number(card) + Number(cheque));

    setTotalAmount(recalculatedTotal);
    setGstTotal(recalculatedGstTotal);
    setNetTotal(recalculatedNetTotal);
    setBalance(recalculatedBalance);
  }, [items, otherCharges, discount, cash, card, cheque]);

  // Add item
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

    setItems([...items, newItem]);
  };

  // Edit item
  const editItem = (index) => {
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
    setItems(items.filter((_, i) => i !== index));
  };

  // Delete item
  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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
      purchaseItemsId,
      items,
    };

    try {
      await axios.put(`${API_URL}/api/purchases/${purchaseId}`, purchaseData);
      console.log("Purchase updated successfully");
      alert("Purchase updated successfully");
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Purchase</h1>
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
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Bill No.</label>
            <input
              type="text"
              value={billNo}
              placeholder="Enter Bill No."
              className="input input-bordered input-sm"
              onChange={(e) => setBillNo(e.target.value)}
            />
          </div>
        </div>
      </div>

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
              onChange={handleItemNameChange}
              onFocus={() => setShowItemSuggestions(!!itemName)}
            />
            {showItemSuggestions && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-50">
                {itemSuggestions.length > 0 ? (
                  itemSuggestions.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => selectItem(item)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {item.itemName}
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
            Add
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
                  <td>{item.discountAmount}</td>
                  <td>{item.netRate}</td>
                  <td>{item.gstPercent}</td>
                  <td>{item.gstAmount}</td>
                  <td>{item.quantity}</td>
                  <td>{item.totalAmount}</td>
                  <td>{item.mrp}</td>
                  <td>
                    <button
                      onClick={() => editItem(index)}
                      className="btn btn-xs btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(index)}
                      className="btn btn-xs btn-danger"
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

      <h3 className="text-lg font-semibold mb-2">Amount Summary</h3>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          <div className="flex-1 border border-gray-300 p-4 rounded">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="form-control w-full lg:w-32">
                <label className="label">Total (Rs.)</label>
                <input
                  type="text"
                  placeholder="Total"
                  value={totalAmount - gstTotal}
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
                  value={otherCharges}
                  className="input input-bordered input-sm"
                  onChange={(e) => setOtherCharges(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">-Discount (Rs.)</label>
                <input
                  type="text"
                  placeholder="Discount"
                  value={discount}
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
                  value={cash}
                  className="input input-bordered input-sm"
                  onChange={(e) => setCash(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Card (Rs.)</label>
                <input
                  type="text"
                  placeholder="Card"
                  value={card}
                  className="input input-bordered input-sm"
                  onChange={(e) => setCard(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Cheque (Rs.)</label>
                <input
                  type="text"
                  placeholder="Cheque Rs."
                  value={cheque}
                  className="input input-bordered input-sm"
                  onChange={(e) => setCheque(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">Cheque No.</label>
                <input
                  type="text"
                  placeholder="Cheque No."
                  value={chequeNo}
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
                  <option value="-All-">-Bank-</option>
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
                  placeholder="Received"
                  value={balance}
                  className="input input-bordered input-sm"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4 flex flex-col items-end border border-gray-300 p-4 rounded">
            <div className="form-control w-full lg:w-48 mb-4">
              <label className="label">Transport</label>
              <select
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="-All-">-select-</option>
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
                value={remark}
                className="input input-bordered input-sm"
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button onClick={handleSubmit} className="btn btn-primary btn-sm">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button className="btn btn-info">Submit</button>
        <button className="btn btn-secondary">Print</button>
      </div>
    </div>
  );
};

export default UpdatePurchase;
