import React from "react";
import { FaSearch } from "react-icons/fa";

const ItemsSales = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4"> Item Sale Summary</h2>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Select Company:</label>
          <select className="select select-bordered select-sm w-48">
            <option>Oppo</option>
            <option>Vivo</option>
          </select>
        </div>
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Select Item:</label>
          <select className="select select-bordered select-sm w-48">
            <option>Oppo A53</option>
            <option>Oppo Reno</option>
            <option>Vivo v23e</option>
          </select>
        </div>

        <button className="btn btn-primary btn-sm w-full sm:w-auto">
          <FaSearch />
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-center">SaleDate</th>
              <th className="p-2 text-center">InvoiceNo</th>
              <th className="p-2 text-center">Total</th>
              <th className="p-2 text-center">Cash</th>
              <th className="p-2 text-center">Cheque</th>
              <th className="p-2 text-center">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="p-2 text-center">13/05/2024</td>
              <td className="p-2 text-center font-semibold">E11</td>
              <td className="p-2 text-center">4350.00</td>
              <td className="p-2 text-center">0.00</td>
              <td className="p-2 text-center">0.00</td>
              <td className="p-2 text-center">4350.00</td>
            </tr>
            {/* Additional rows can be added here */}
            <tr className="font-semibold bg-gray-100">
              <td className="p-2 text-center" colSpan="2">
                Total ---
              </td>
              <td className="p-2 text-center">4350</td>
              <td className="p-2 text-center">0</td>
              <td className="p-2 text-center">0</td>
              <td className="p-2 text-center">4350</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsSales;
