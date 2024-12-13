import React, { useEffect, useState } from "react";
import axios from "axios";
const AddInvoice = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [customerName, setCustomerName] = useState("");

  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);


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

   const handleCustomerChange = (e) => {
    const input = e.target.value;
    setCustomerName(input);
  
    if (input) {
      const matches = customers.filter((customer) =>
        customer.full_name.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCustomers(matches);
      setShowCustomerSuggestions(true);
    } else {
      setFilteredCustomers([]);
      setShowCustomerSuggestions(false);
    }
  };
  
  const selectCustomer = (customer) => {
    console.log("selected customer is" , customer)
    setCustomerName(customer.full_name);
    setContactNo(customer.contactNo);
    setAddress(customer.address);
    setGstin(customer.gstin);
    setState(customer.state);
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


   console.log("our customers",customers)

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Item Sale</h1>

      {/* Invoice Number */}
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">
          Invoice No. <span className="text-green-600">4 hello</span>{" "}
          <span className="text-red-600">107</span>
        </h2>
      </div> */}

      <h3 className="text-lg font-semibold mb-2">Customer</h3>
      {/* Customer Information */}
      <div className="border border-gray-300 p-4 mb-4 rounded">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="form-control w-full sm:w-48">
            <label className="label">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="input input-bordered input-sm"
              onFocus={() => setShowCustomerSuggestions(true)}
              // onFocus={() => setShowSuggestions(!!customerName)}
            />
  {showCustomerSuggestions && filteredCustomers.length > 0 && (
    <ul className="suggestion-box">
      {filteredCustomers.map((customer) => (
        <li
          key={customer._id}
          onClick={() => selectCustomer(customer)}
        >
          {customer.full_name}
        </li>
      ))}
    </ul>
  )}
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Contact No. </label>
            <input
              type="text"
              placeholder="Enter contact number"
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">Address</label>
            <input
              type="text"
              placeholder="Enter address"
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">GSTIN</label>
            <input
              type="text"
              placeholder="Enter GSTIN"
              className="input input-bordered input-sm"
            />
          </div>
          <div className="form-control w-full sm:w-48">
            <label className="label">State</label>
            <select className="select select-bordered select-sm">
              <option>-select-</option>
              <option>Andhra Pradesh</option>
              <option>Arunachal Pradesh</option>
              <option>Assam</option>
              <option>Bihar</option>
              <option>Chhattisgarh</option>
              <option>Goa</option>
              <option>Gujarat</option>
              <option>Haryana</option>
              <option>Himachal Pradesh</option>
              <option>Jammu and Kashmir</option>
              <option>Jharkhand</option>
              <option>Karnataka</option>
              <option>Kerala</option>
              <option>Madhya Pradesh</option>
              <option>Maharashtra</option>
              <option>Manipur</option>
              <option>Meghalaya</option>
              <option>Mizoram</option>
              <option>Nagaland</option>
              <option>Odisha</option>
              <option>Punjab</option>
              <option>Rajasthan</option>
              <option>Sikkim</option>
              <option>Tamil Nadu</option>
              <option>Telangana</option>
              <option>Tripura</option>
              <option>Uttar Pradesh</option>
              <option>Uttarakhand</option>
              <option>West Bengal</option>
              <option>Andaman and Nicobar Islands</option>
              <option>Chandigarh</option>
              <option>Dadra and Nagar Haveli and Daman and Diu</option>
              <option>Delhi</option>
              <option>Lakshadweep</option>
              <option>Puducherry</option>
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
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-40">
            <input
              type="text"
              placeholder="Item"
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="HSN"
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="MRP (Rs.)"
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Dis(%)"
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="text"
              placeholder="Dis (Rs.)"
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-32">
            <input
              type="text"
              placeholder="Rate"
              className="input input-bordered input-xs"
            />
          </div>
          <div className="form-control w-full sm:w-24">
            <input
              type="number"
              placeholder="Qty"
              className="input input-bordered input-xs"
              defaultValue="1"
            />
          </div>
          <div className="form-control w-full sm:w-32">
            <select className="select select-bordered select-xs">
              <option>-UOM-</option>
              <option>KG</option>
              <option>GRAM</option>
              <option>Litre</option>
            </select>
          </div>
          <div className="form-control w-full sm:w-40">
            <input
              type="text"
              placeholder="GST(%)"
              className="input input-bordered input-xs"
            />
          </div>
          <button className="btn btn-info btn-xs">Save</button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Particular</th>
                <th>MRP</th>
                <th>Dis(%)</th>
                <th>Dis (Rs.)</th>
                <th>Rate</th>
                <th>GST(%)</th>
                <th>GST (Rs.)</th>
                <th>Qty</th>
                <th>Total (Rs.)</th>
                <th>HSN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="11" className="text-center">
                  Please Add Items
                </td>
              </tr>
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
                  placeholder="Total"
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">GST Total</label>
                <input
                  type="text"
                  placeholder="GST Total"
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Transport (Rs.)</label>
                <input
                  type="text"
                  placeholder="Transport"
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Discount (Rs.)</label>
                <input
                  type="text"
                  placeholder="Discount"
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Net Total</label>
                <input
                  type="text"
                  placeholder="Net Total"
                  className="input input-bordered bg-gray-100 input-sm"
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
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Card (Rs.)</label>
                <input
                  type="text"
                  placeholder="Card"
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Bank</label>
                <select className="select select-bordered select-sm">
                  <option>-select-</option>
                  <option>Kotak</option>
                  <option>BOK</option>
                </select>
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Balance (Rs.)</label>
                <input
                  type="text"
                  placeholder="Balance"
                  className="input input-bordered input-sm"
                />
              </div>
              <div className="form-control w-full sm:w-32">
                <label className="label">Received (Rs.)</label>
                <input
                  type="text"
                  placeholder="Received"
                  className="input input-bordered input-sm"
                />
              </div>
            </div>
          </div>

          {/* Right section for Transport, Remark, and Save Button */}
          <div className="w-full lg:w-1/4 flex flex-col items-end border border-gray-300 p-4 rounded">
            <div className="form-control w-full lg:w-48 mb-4">
              <label className="label">Transport</label>
              <select className="select select-bordered select-sm">
                <option value="-All-">-select-</option>

                {/* {transports.map((transport) => (
                  <option key={transport._id} value={transport._id}>
                    {transport.transporter}
                  </option>
                ))} */}
              </select>
            </div>
            <div className="form-control w-full lg:w-48 mb-4">
              <label className="label">Remark</label>
              <input
                type="text"
                placeholder="Remark"
                className="input input-bordered input-sm"
              />
            </div>
            <div className="flex items-center">
              <button className="btn btn-primary btn-sm">Save</button>
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

export default AddInvoice;
