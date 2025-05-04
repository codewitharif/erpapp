import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
const AddInvoice = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [customerName, setCustomerName] = useState("");

  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);

  //state for invoice
  const [invoiceNo, setInvoiceNo] = useState("");

  //states for customer info
  const [fullName, setFullName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [state, setState] = useState("");

  const [companies, setCompanies] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [bankAccounts, setbankAccounts] = useState([]);
  const [transports, setTransports] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  //states for amount summary section
  const [customerId, setCustomerId] = useState("");
  const [saleDate, setSaleDate] = useState("");
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
  const [remark, setRemark] = useState("");
  const [transportId, setTransportId] = useState("");

  // States for sold item fields
  const [companyId, setcompanyId] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [hsn, setHsn] = useState("");
  const [uom, setUom] = useState("");
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

  // State to track the item being edited
  const [editIndex, setEditIndex] = useState(null);

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
    console.log("calculation ho rha hai ok na");
    const discountRsValue = (Number(rate) * Number(discountPercent)) / 100;
    const netRateValue = Number(rate) - discountRsValue;
    let gstValue = (netRateValue * Number(gstPercent)) / 100;
    gstValue *= quantity;
    const totalValue = netRateValue * Number(quantity) + gstValue;

    setDiscountRs(discountRsValue);
    setNetRate(netRateValue);
    setGst(gstValue);
    setTotal(totalValue);
  }, [rate, discountPercent, gstPercent, quantity]);

  useEffect(() => {
    //fetch all customers
    axios
      .get(`${API_URL}/api/customers`)
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error("Error fetching companies:", error));

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

  //autofill code for customer selection

  const handleCustomerChange = (e) => {
    const input = e.target.value;
    setCustomerName(input);

    if (input) {
      const matches = customers.filter((customer) =>
        customer.full_name.toLowerCase().startsWith(input.toLowerCase())
      );
      console.log(matches);
      setFilteredCustomers(matches);
      setShowCustomerSuggestions(true);
    } else {
      setFilteredCustomers([]);
      setShowCustomerSuggestions(false);
    }
  };

  const selectCustomer = (customer) => {
    console.log("selected customer is", customer);
    console.log("selected customer state is ", customer.city);
    console.log("selected customer contact is ", customer.contactNo);

    setFullName(customer.full_name);
    setCustomerName(customer.full_name);
    setContactNo(customer.contact_no);
    setAddress(customer.address);
    setGstin(customer.gstin);
    setState(customer.city);
    setCustomerId(customer._id); // Set customer ID if needed for the backend
    setShowCustomerSuggestions(false);
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
  const handleUomChange = (e) => {
    console.log("current value of uom is ", e.target.value);
    setUom(e.target.value);
  };

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
      totalAmount: total,
      uom,
    };
    console.log("our new item is ", newItem);

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

    // Update items state with the new item
    // setItems((prevItems) => [...prevItems, newItem]);
  };

  // Submit handler to create the sale object and call the API
  const handleSubmit = async () => {
    const salesData = {
      customerId,
      invoiceNo,
      totalAmount,
      discount,
      transportCharges: otherCharges,
      gstTotal,
      netTotal,
      balance,
      cash,
      card,
      bankId,
      transportId,
      remark,
      items,
    };

    try {
      console.warn(salesData);
      console.log(salesData);
      const response = await axios.post(`${API_URL}/api/sales`, salesData);
      alert("sales saved succesfully");
      console.log("sales saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving sales:", error);
    }
  };

  //code for autofill of item selection
  const handleItemInputChange = (value) => {
    console.log("item name is ", value);
    setItemName(value);
    const matches = allItems.filter((item) =>
      item.item.toLowerCase().startsWith(value.toLowerCase())
    );
    console.log("your item matches is ", matches);
    setFilteredItems(matches);
  };

  const handleItemSelect = (selectedItem) => {
    console.log("our selected item is ", selectedItem);

    // Find the supplier name from the suppliers list
    setcompanyId(selectedItem.companyId);
    setItemCode(selectedItem.itemcode);
    setItemName(selectedItem.item);
    setHsn(selectedItem.hsn);
    setRate(selectedItem.mrpinrs);
    // setDiscountPercent();
    // setDiscountRs();
    // setQuantity();
    // setUom()
    // setGstPercent(selectedItem.gstPercent);
    setNetRate(selectedItem.mrpinrs);
    setFilteredItems([]); // Clear suggestions after selecting an item
  };
  console.log("bhai ye ", uom);

  const handleEdit = (index) => {
    const item = items[index];
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

  return (
    <div className="p-4">
      <Toaster position="top-center"></Toaster>
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Add Sale</h1>

      {/* Invoice Number */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">
          Invoice No :{" "}
          <span className="text-red-600">
            <input
              type="text"
              className="input input-bordered input-xs"
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </span>{" "}
        </h2>
      </div>

      <h3 className="text-lg font-semibold mb-2">Customer</h3>
      {/* Customer Information */}
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="form-control w-full sm:w-48">
            <label className="label">Full Name</label>
            <input
              type="text"
              value={customerName}
              placeholder="Enter full name"
              className="input input-bordered input-sm"
              onChange={handleCustomerChange}
              // onFocus={() => setShowCustomerSuggestions(true)}
              onFocus={() => setShowSuggestions(!!selectCustomer)}
            />
            <div className="relative">
              {showCustomerSuggestions && filteredCustomers.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 max-h-40 overflow-y-auto z-50">
                  {filteredCustomers.map((customer) => (
                    <li
                      key={customer._id}
                      onClick={() => selectCustomer(customer)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {customer.full_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Contact No. </label>
            <input
              type="text"
              value={contactNo}
              placeholder="Enter contact number"
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Address</label>
            <input
              type="text"
              value={address}
              placeholder="Enter address"
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">GSTIN</label>
            <input
              type="text"
              value={gstin}
              placeholder="Enter GSTIN"
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">State</label>
            <select value={state} className="select select-bordered select-sm">
              <option value="">-select-</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">
                Dadra and Nagar Haveli and Daman and Diu
              </option>
              <option value="Delhi">Delhi</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Puducherry">Puducherry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sold Items */}
      <h3 className="text-lg font-semibold mb-2">Sold Items</h3>
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="Item Code"
              value={itemCode}
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-40">
            <input
              type="text"
              placeholder="Item"
              value={itemName}
              onChange={(e) => {
                handleItemInputChange(e.target.value);
                setItemName(e.target.value);
              }}
              className="input input-bordered input-xs"
            />

            <div className="relative">
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
          </div>
          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="HSN"
              value={hsn}
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Rate (Rs.)"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Dis(%)"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Dis (Rs.)"
              value={discountRs}
              onChange={(e) => setDiscountRs(e.target.value)}
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="Rate"
              value={netRate}
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input input-bordered input-xs"
              defaultValue="1"
            />
          </div>
          <div className="form-control w-full sm:w-32">
            <select
              value={uom}
              onChange={handleUomChange}
              className="select select-bordered select-xs"
            >
              <option value="">-UOM-</option>
              <option value="KG">KG</option>
              <option value="GRAM">GRAM</option>
              <option value="LITRE">LITRE</option>
              <option value="ML">ML (Millilitre)</option>
              <option value="METER">METER</option>
              <option value="CM">CM (Centimeter)</option>
              <option value="PCS">PCS (Pieces)</option>
            </select>
          </div>
          <div className="form-control w-full sm:w-40">
            <input
              type="text"
              placeholder="GST(%)"
              value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)}
              className="input input-bordered input-xs"
            />
          </div>
          {/* <button onClick={addItem} className="btn btn-info btn-xs">
            Add
          </button> */}

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
                <th>Rate</th>
                <th>Dis(%)</th>
                <th>Dis (Rs.)</th>
                <th>Net Rate</th>
                <th>GST(%)</th>
                <th>GST (Rs.)</th>
                <th>Qty</th>
                <th>Total (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td colSpan="11" className="text-center">
                  Please Add Items
                </td>

              </tr> */}

              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.rate}</td>
                  <td>{item.discountPercent}</td>
                  <td>{item.discountAmount || 0}</td>
                  <td>{item.netRate}</td>
                  <td>{item.gstPercent}</td>
                  <td>{item.gstAmount}</td>
                  <td>{item.quantity}</td>
                  <td>{item.totalAmount}</td>
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
              <div className="form-control w-full sm:w-32">
                <label className="label">Total (Rs.)</label>
                <input
                  type="text"
                  value={totalAmount}
                  placeholder="Total"
                  className="input input-bordered input-sm"
                  onChange={(e) => setTotalAmount(e.target.value)}
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">GST Total</label>
                <input
                  type="text"
                  value={gstTotal}
                  placeholder="GST Total"
                  className="input input-bordered input-sm"
                  onChange={(e) => setGstTotal(e.target.value)}
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Transport (Rs.)</label>
                <input
                  type="text"
                  placeholder="Transport"
                  className="input input-bordered input-sm"
                  onChange={(e) => setOtherCharges(e.target.value)}
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Discount (Rs.)</label>
                <input
                  type="text"
                  placeholder="Discount"
                  className="input input-bordered input-sm"
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Net Total</label>
                <input
                  type="text"
                  value={netTotal}
                  placeholder="Net Total"
                  className="input input-bordered bg-gray-100 input-sm"
                  onChange={(e) => setNetTotal(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="form-control w-full sm:w-32">
                <label className="label">Cash (Rs.)</label>
                <input
                  type="text"
                  placeholder="Cash"
                  className="input input-bordered input-sm"
                  onChange={(e) => setCash(e.target.value)}
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Card (Rs.)</label>
                <input
                  type="text"
                  placeholder="Card"
                  className="input input-bordered input-sm"
                  onChange={(e) => setCard(e.target.value)}
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Bank</label>
                <select
                  onChange={(e) => setBankId(e.target.value)}
                  className="select select-bordered select-sm"
                >
                  <option>-select-</option>

                  {bankAccounts.map((bank) => (
                    <option key={bank._id} value={bank._id}>
                      {bank.bankName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Balance (Rs.)</label>
                <input
                  type="text"
                  placeholder="Balance"
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

export default AddInvoice;
