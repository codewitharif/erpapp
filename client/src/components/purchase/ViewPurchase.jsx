import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import easyinvoice from "easyinvoice";
import toast, { Toaster } from "react-hot-toast";

const ViewPurchase = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [supplierFilter, setsupplierFilter] = useState("-All-");
  const [selectedSupplier, setselectedSupplier] = useState("-All-");

  const [purchaseSummaryData, setPurchaseSummaryData] = useState(null); // Store all fetched data

  const [terms, setTerms] = useState([]);

  const fetchSummaryData = () => {
    axios
      .get(`${API_URL}/api/purchases/summary-for-home`)
      .then((response) => setPurchaseSummaryData(response.data.summary))
      .catch((error) => console.log("Error fetching purchase summary:", error));
  };

  useEffect(() => {
    fetchSummaryData();
    axios
      .get(`${API_URL}/api/terms`)
      .then((response) => setTerms(response.data))
      .catch((error) => console.error("Error fetching terms:", error));
  }, []); // Refetch data when filters change

  const handleEditClick = (purchaseId) => {
    console.log("the supplier id is ", purchaseId);
    console.log("the supplier id is ", selectedSupplier);
    navigate(`/updatePurchase/${purchaseId}`);
    // const purchaseDetail = purchases.filter(
    //   (purchase) => purchase._id === purchaseId
    // );

    // console.log("my purchase detail is ", purchaseDetail);
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/suppliers`)
      .then((response) => setSuppliers(response.data.suppliers))
      .catch((error) => console.error("Error fetching suppliers:", error));
    axios
      .get(`${API_URL}/api/purchases`)
      .then((response) => setPurchases(response.data.purchases))
      .catch((error) => console.error("Error fetching purchases:", error));
  }, []);

  const handleDeleteClick = async (purchaseId) => {
    try {
      console.log("the delete  purchase id is ", purchaseId);
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((sup) => sup._id === supplierId);
    return supplier ? supplier.supplierName : "Unknown Supplier";
  };

  const filteredPurchases = purchases.filter((purchase) =>
    selectedSupplier === "-All-"
      ? true
      : purchase.supplierId === selectedSupplier
  );

  // getSupplierDetails function to get supplier details
  // This function can be used to get the address, city, zip, and country of a supplier

  const getSupplierDetails = (supplierId) => {
    const supplier = suppliers.find((sup) => sup._id === supplierId);
    return supplier
      ? {
          address: supplier.address,
          city: supplier.state,
          zip: "000000", // Agar supplier API mein zip nahi aata to default de sakte ho
          country: "India",
        }
      : {
          address: "Unknown Address",
          city: "Unknown City",
          zip: "000000",
          country: "India",
        };
  };

  // handlePrintClick function to generate and print the invoice

  const handlePrintClick = async (purchaseId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/purchases/${purchaseId}`
      );
      const purchase = response.data.purchase;

      // Fetch supplier details using the supplierId from the purchase
      const supplierDetails = getSupplierDetails(purchase.supplierId);

      // Map your API purchase structure to easyinvoice format
      const invoiceData = {
        sender: {
          company: "ARIFA ENTERPRISES",
          address: "RETGHAT, NEAR KAMLA PARK",
          zip: "462001",
          city: "BHOPAL",
          country: "INDIA",
        },
        client: {
          company: getSupplierName(purchase.supplierId),
          address: supplierDetails.address,
          zip: "00000",
          city: supplierDetails.state,
          country: "India",
        },
        information: {
          number: purchase.billNo,
          date: new Date(purchase.purchaseDate).toISOString().split("T")[0],
          "due-date": new Date(
            new Date(purchase.purchaseDate).setDate(
              new Date(purchase.purchaseDate).getDate() + 15
            )
          )
            .toISOString()
            .split("T")[0],
        },
        products: purchase.purchaseItemsId.items.map((item) => ({
          quantity: item.quantity,
          description: item.itemName,
          "tax-rate": item.gstPercent,
          price: item.netRate,
        })),
        settings: {
          currency: "INR",
        },
        "bottom-notice": `Terms & Conditions: ${terms
          .map((term) => term.terms)
          .join("<br/>")} \n<br/><br/>Thank you for your business!`,
      };

      const result = await easyinvoice.createInvoice(invoiceData);

      // Convert base64 PDF to Blob and open in new tab
      const pdfBlob = new Blob(
        [Uint8Array.from(atob(result.pdf), (c) => c.charCodeAt(0))],
        { type: "application/pdf" }
      );
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <h2 className="text-2xl font-bold mb-4">Supplier Items</h2>
      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Item:</label>
          <input
            type="text"
            placeholder="Item"
            className="input input-bordered input-sm w-full lg:w-32"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Supplier:</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setselectedSupplier(e.target.value)}
            className="select select-bordered select-sm w-full lg:w-32"
          >
            <option value="-All-">-All-</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">From:</label>
          <input
            type="date"
            className="input input-bordered input-sm w-full lg:w-32"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">To:</label>
          <input
            type="date"
            className="input input-bordered input-sm w-full lg:w-32"
          />
        </div>

        <button className="btn btn-primary btn-sm w-full sm:w-auto">
          <FaSearch />
        </button>
      </div>
      {/* Purchase Table */}
      <div>
        <h3 className="text-center font-semibold mb-2">
          Purchases for the month Oct 2024
        </h3>
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Purchase Date</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Bill No</th>
                <th className="p-2 border">Total (Rs.)</th>
                <th className="p-2 border">Dis (Rs.)</th>
                <th className="p-2 border">GST (Rs.)</th>
                <th className="p-2 border">Other (Rs.)</th>
                <th className="p-2 border">Net Total</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase, index) => (
                <tr key={purchase._id} className="text-center">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">
                    {new Date(purchase.createdAt).toISOString().split("T")[0]}
                  </td>
                  <td className="p-2 border">
                    {getSupplierName(purchase.supplierId)}
                  </td>
                  <td className="p-2 border">{purchase.billNo}</td>
                  <td className="p-2 border">{purchase.totalAmount}</td>
                  <td className="p-2 border">{purchase.discount}</td>
                  <td className="p-2 border">{purchase.gstTotal}</td>
                  <td className="p-2 border">{purchase.otherCharges}</td>
                  <td className="p-2 border">{purchase.netTotal}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEditClick(purchase._id)}
                      className="btn btn-warning btn-xs mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-error btn-xs"
                      onClick={() => handleDeleteClick(purchase._id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="btn btn-primary btn-xs ml-2"
                      onClick={() => handlePrintClick(purchase._id)}
                    >
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="text-center">
                <td className="p-2 border" colSpan="4">
                  Total
                </td>
                <td className="p-2 border">{purchaseSummaryData?.netTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchase;
