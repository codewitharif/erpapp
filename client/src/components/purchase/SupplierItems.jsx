import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
const SupplierItems = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [suppliers, setSuppliers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/suppliers`)
      .then((response) => setSuppliers(response.data.suppliers))
      .catch((error) => console.error("Error fetching sppliers:", error));
    axios
      .get(`${API_URL}/api/companies`)
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  console.log("here is all my companies", companies);
  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Supplier</label>
          <select className="select select-bordered select-sm sm:w-40">
            <option value="-All-">-select-</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Company</label>
          <select className="select select-bordered select-sm sm:w-40">
            <option value="-select-">-select-</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Item</label>
          <input
            type="text"
            name="item"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter Item"
          />
          {/* <select className="select select-bordered select-sm sm:w-40">
            <option value="Supplier1">Item1</option>
            <option value="Supplier2">Item2</option>
          </select> */}
        </div>

        <button className="btn btn-primary btn-sm w-full sm:w-auto">Add</button>
      </div>
    </div>
  );
};

export default SupplierItems;
