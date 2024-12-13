import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const UpdatePurchase = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;
  const { purchaseId } = useParams();
  console.log("my purchase id is ", purchaseId);

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
  const [purchaseItemsId, setpurchaseItemsId] = useState("");
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
  const [total, setTotal] = useState(0); // Add `total` as a state variable

  // discountRs = (Number(rate) * Number(discountPercent)) / 100;
  // netRate = Number(rate) - discountRs;
  // gst = (netRate * Number(gstPercent)) / 100;
  // gst *= quantity;
  // total = (netRate + gst) * Number(quantity);

  // Items array to hold individual item objects
  const [items, setItems] = useState([]);

  const fetchPurchase = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/purchases/${purchaseId}`
      );
      const data = response.data.purchase;

      // Find the supplier name from the suppliers list

      setSupplierId(data.supplierId);
      console.log("my supplier id is ", supplierId, "and ", data.supplierId);
      const supplier = suppliers.find((s) => s._id === data.supplierId);
      console.log("my supplier is ", supplier);
      setSupplierName(supplier ? supplier.supplierName : "Unknown Supplier");
      // Convert purchaseDate to "yyyy-MM-dd" format
      const formattedDate = new Date(data.purchaseDate)
        .toISOString()
        .split("T")[0];
      setPurchaseDate(formattedDate);

      setBillNo(data.billNo);

      setBankId(data.bankId);
      setGst(data.gstTotal);
      setTotalAmount(data.totalAmount || "");
      setGstTotal(data.gstTotal || "");
      setOtherCharges(data.otherCharges);
      setDiscount(data.discount || "");
      setNetTotal(data.netTotal || "");
      setCash(data.cash || "");
      setCard(data.card || "");
      setCheque(data.cheque || "");
      setChequeNo(data.chequeNo || "");
      setBankId(data.bankId || "");
      setBalance(data.balance || "");
      setTransportId(data.transportId || "");
      setRemark(data.remark || "");
      console.log("my purchase items id is ", data.purchaseItemsId._id);
      setpurchaseItemsId(data.purchaseItemsId._id);

      console.log("update purchase data is ", data);
      console.log("update purchase balnce is ", data.balance);
      console.log("update purchase net total is ", data.netTotal);
      setItems(data.purchaseItemsId.items);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  };
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
  }, []);
  useEffect(() => {
    // Only fetch purchase data when suppliers have been loaded
    if (suppliers.length > 0) {
      fetchPurchase();
    }
  }, [suppliers]);
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
  useEffect(() => {
    const discountRsValue = (Number(rate) * Number(discountPercent)) / 100;
    const netRateValue = Number(rate) - discountRsValue;
    const gstValue =
      ((netRateValue * Number(gstPercent)) / 100) * Number(quantity);
    const totalValue = (netRateValue + gstValue) * Number(quantity);

    setDiscountRs(discountRsValue);
    setNetRate(netRateValue);
    setGst(gstValue);
    setTotal(totalValue);
  }, [rate, discountPercent, gstPercent, quantity]);

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
  const handleSubmit = async () => {
    // Recalculate totals based on items array before submission
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

    const purchaseData = {
      supplierId,
      purchaseDate,
      billNo,
      totalAmount: recalculatedTotal,
      gstTotal: recalculatedGstTotal,
      otherCharges,
      discount,
      netTotal: recalculatedNetTotal,
      balance: recalculatedBalance,
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
      console.warn(purchaseData);
      console.log("Purchase ID being sent:", purchaseId);

      const response = await axios.put(
        `${API_URL}/api/purchases/${purchaseId}`,
        purchaseData
      );

      console.log("Purchase update successfully:", response.data);
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };
  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Update Purchase</h1>
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
          <div className="form-control w-full sm:w-40">
            <input
              type="text"
              placeholder="Item"
              className="input input-bordered input-xs"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
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
                  <td>{item.discountAmount || item.discountRs}</td>
                  <td>{item.netRate}</td>
                  <td>{item.gstPercent}</td>
                  <td>{item.gstAmount || item.gst}</td>
                  <td>{item.quantity}</td>
                  <td>{item.totalAmount || item.total}</td>
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
                value={remark}
                className="input input-bordered input-sm"
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
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
