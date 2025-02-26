import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewInvoice = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  //api calls  on page loading
  useEffect(() => {
    axios
      .get(`${API_URL}/api/sales`)
      .then((response) => setSales(response.data.sales))
      .catch((error) => console.log("Error in fetching sales ", error));
    axios
      .get(`${API_URL}/api/customers`)
      .then((response) => setCustomers(response.data))
      .catch((error) => console.log("Error in fetching customers ", error));
  }, []);

  const handleEditClick = (saleId) => {
    console.log("the supplier id is ", saleId);
    navigate(`/updateSales/${saleId}`);
    // const purchaseDetail = purchases.filter(
    //   (purchase) => purchase._id === purchaseId
    // );

    // console.log("my purchase detail is ", purchaseDetail);
  };

  console.log("my sales are ", sales);
  console.log("my customers are ", customers);
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Customer Name:</label>
          <input
            type="text"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter customer name"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">From </label>
          <input
            type="date"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="from-date"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">To </label>
          <input
            type="date"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="to-date"
          />
        </div>

        <button className="btn btn-primary btn-sm w-full sm:w-auto">
          <FaSearch />
        </button>
      </div>

      {/*  */}

      {/* Table Title */}
      <h2 className="text-center font-bold text-lg mb-4">
        Invoices from 01/01/2024 to 01/10/2024
      </h2>

      {/* Invoice Table */}
      <div className="overflow-x-auto">
        <table className="table  table-xs w-full text-sm">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>InvoiceNo</th>
              <th>Customer</th>
              <th>SaleTotal</th>
              <th>Discount</th>
              <th>GST (Rs.)</th>
              <th>Transport Charges</th>
              <th>Cash</th>
              <th>Card</th>
              <th>Balance</th>
              <th>SaleDate</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {/* {sales.map((sale, index) => (
              <tr key={sale.id || index}>
                <td>{index + 1}</td>
                <td>{sale.invoiceNo}</td>
                <td>{sale.customerId}</td>
                <td>{sale.netTotal}</td>
                <td>{sale.discount}</td>
                <td>{sale.gstTotal}</td>
                <td>{sale.transportCharges}</td>
                <td>{sale.cash}</td>
                <td>{sale.card}</td>
                <td>{sale.balance}</td>
                <td>{new Date(sale.saleDate).toLocaleString()}</td>
                <td>
                  <button className="btn btn-warning btn-xs mr-2">
                    <FaEdit />
                  </button>
                  <button className="btn btn-error btn-xs">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))} */}
            {sales.map((sale, index) => {
              const customer = customers.find(
                (customer) => customer._id === sale.customerId
              );
              return (
                <tr key={sale._id || index}>
                  <td>{index + 1}</td>
                  <td>{sale.invoiceNo}</td>
                  <td>{customer ? customer.full_name : "Unknown"}</td>
                  <td>{sale.netTotal}</td>
                  <td>{sale.discount}</td>
                  <td>{sale.gstTotal}</td>
                  <td>{sale.transportCharges}</td>
                  <td>{sale.cash}</td>
                  <td>{sale.card}</td>
                  <td>{sale.balance}</td>
                  <td>{new Date(sale.saleDate).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-xs mr-2"
                      onClick={() => handleEditClick(sale._id)}
                    >
                      <FaEdit />
                    </button>
                    <button className="btn btn-error btn-xs">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewInvoice;
