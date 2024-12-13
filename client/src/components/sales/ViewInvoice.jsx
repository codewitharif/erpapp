import React from "react";
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from "react-icons/fa";
const ViewInvoice = () => {
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
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>InvoiceNo</th>
              <th>Customer</th>
              <th>SaleTotal</th>
              <th>Discount</th>
              <th>GST (Rs.)</th>
              <th>Freight</th>
              <th>Cash</th>
              <th>Card</th>
              <th>Cheque</th>
              <th>Balance</th>
              <th>SaleDate</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Row */}
            <tr>
              <td>1</td>
              <td>16</td>
              <td>Naman Ji</td>
              <td>8012.00</td>
              <td>0.00</td>
              <td>1238.00</td>
              <td>500.00</td>
              <td>5000.00</td>
              <td>1000.00</td>
              <td>0.00</td>
              <td>9750.00</td>
              <td>01/10/2024 06:27</td>
              <td>
                <button className="btn btn-warning btn-xs mr-2">
                  <FaEdit />
                </button>
                <button className="btn = btn-error btn-xs ">
                  <FaTrash />
                </button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewInvoice;
