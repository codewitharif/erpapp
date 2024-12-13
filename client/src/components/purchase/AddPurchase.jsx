import React, { useEffect, useState } from "react";
import axios from "axios";
const AddPurchase = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [bankAccounts, setbankAccounts] = useState([]);
  const [transports, setTransports] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // States for form fields
  const [supplierId, setSupplierId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [billNo, setBillNo] = useState("");
  let [totalAmount, setTotalAmount] = useState(0);
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
  const [companyId, setcompanyId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [hsn, setHsn] = useState("");
  const [rate, setRate] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  let [discountRs, setDiscountRs] = useState(0);
  let [netRate, setNetRate] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [gstPercent, setGstPercent] = useState(0);
  let [gst, setGst] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [total, setTotal] = useState(0);

  // Items array to hold individual item objects
  const [items, setItems] = useState([]);

  // autofill for suggestion states
  const [allItems, setAllItems] = useState([]); // Store all items fetched from api/stocks
  const [filteredItems, setFilteredItems] = useState([]); // Store filtered items for suggestions

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

  useEffect(() => {
    const discountRsValue = (Number(rate) * Number(discountPercent)) / 100;
    const netRateValue = Number(rate) - discountRsValue;
    let gstValue = (netRateValue * Number(gstPercent)) / 100;
    gstValue *= quantity;
    const totalValue = (netRateValue + gstValue) * Number(quantity);

    setDiscountRs(discountRsValue);
    setNetRate(netRateValue);
    setGst(gstValue);
    setTotal(totalValue);
  }, [rate, discountPercent, gstPercent, quantity]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/companies`)
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));

    // Fetch all suppliers
    axios
      .get(`${API_URL}/api/suppliers`)
      .then((response) => setSuppliers(response.data.suppliers))
      .catch((error) => console.error("Error fetching suppliers:", error));
    //fetch all bank accounts
    axios
      .get(`${API_URL}/api/bankAccounts`)
      .then((response) => setbankAccounts(response.data))
      .catch((error) => console.error("Error fetching suppliers:", error));
    axios
      .get(`${API_URL}/api/transports`)
      .then((response) => setTransports(response.data))
      .catch((error) => console.error("Error fetching suppliers:", error));

    // Fetch all items for autofill
    axios
      .get(`${API_URL}/api/stocks`)
      .then((response) => setAllItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleSupplierChange = (e) => {
    const input = e.target.value;
    setSupplierId(input);

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

  const selectSupplier = (supplier) => {
    setSupplierName(supplier.supplierName);
    setSupplierId(supplier._id);
    setShowSuggestions(false);
  };

  // const calculateSummary = () => {
  //   const totalAmount = items.reduce((acc, item) => acc + item.total, 0);
  //   const gstTotal = items.reduce((acc, item) => acc + item.gst, 0);
  //   const netTotal =
  //     totalAmount +
  //     gstTotal +
  //     parseFloat(otherCharges || 0) -
  //     parseFloat(discount || 0);

  //   setTotalAmount(totalAmount);
  //   setGstTotal(gstTotal);
  //   setNetTotal(netTotal);
  // };
  const calculateSummary = () => {
    const totalAmount = items.reduce((acc, item) => acc + item.netRate, 0);
    const gstTotal = items.reduce((acc, item) => acc + item.gstAmount, 0);
    const netTotal = items.reduce((acc, item) => acc + item.totalAmount, 0);

    console.log("the value of nettotal is ", netTotal);

    const totalDiscountRs = items.reduce(
      (acc, item) => acc + item.discountAmount,
      0
    );

    let fnetTotal = netTotal + Number(otherCharges) - Number(discount);

    setTotalAmount(netTotal - gstTotal);
    setGstTotal(gstTotal);
    setNetTotal(fnetTotal);
    setBalance(fnetTotal);
  };

  useEffect(() => {
    calculateSummary();
  }, [items, otherCharges, discount]);

  // Function to add an item to the items state
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
    console.log("our new item is ", newItem);

    // Update items state with the new item
    setItems((prevItems) => [...prevItems, newItem]);
  };

  // Submit handler to create the purchase object and call the API
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
      console.warn(purchaseData);
      console.log(purchaseData);
      const response = await axios.post(
        `${API_URL}/api/purchases`,
        purchaseData
      );
      alert("purchased saved succesfully");
      console.log("Purchase saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving purchase:", error);
    }
  };

  //code for autofill purchases
  const handleItemInputChange = (value) => {
    setItemName(value);
    const matches = allItems.filter((item) =>
      item.item.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredItems(matches);
  };

  const handleItemSelect = (selectedItem) => {
    console.log(selectedItem);

    // Find the supplier name from the suppliers list

    setcompanyId(selectedItem.companyId);
    setItemCode(selectedItem.itemcode);
    setItemName(selectedItem.item);
    setHsn(selectedItem.hsn);
    setRate(selectedItem.rate);
    setGstPercent(selectedItem.gstPercent);
    setRate(selectedItem.mrpinrs);
    setFilteredItems([]); // Clear suggestions after selecting an item
  };
  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">New Purchase </h1>

      <h3 className="text-lg font-semibold mb-2">Supplier</h3>
      {/* Customer Information */}
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
            <label className="label">Purchase Date </label>
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
              onChange={(e) => setcompanyId(e.target.value)}
              className="select select-bordered select-xs"
            >
              <option value="-All-">-company-</option>

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
              placeholder=" Net Rate"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amount Summary */}
      <h3 className="text-lg font-semibold mb-2">Amount Summary</h3>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        {/* Flex container to separate left and right sections */}
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
                  onChange={(e) => setTotalAmount(e.target.value)}
                />
              </div>
              <div className="form-control w-full lg:w-32">
                <label className="label">GST Total</label>
                <input
                  type="text"
                  placeholder="GST Total"
                  value={gstTotal}
                  className="input input-bordered input-sm"
                  onChange={(e) => setGstTotal(e.target.value)}
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
                  onChange={(e) => setNetTotal(e.target.value)}
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
                  <option value="-All-">-select-</option>

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
                  className="input input-bordered input-sm"
                  onChange={(e) => setBalance(e.target.value)}
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
                className="input input-bordered input-sm"
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                Save
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

export default AddPurchase;
