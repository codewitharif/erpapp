import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const Company = () => {
  const [company, setCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCompanyName, setEditedCompanyName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // 👈 select box ke liye state

  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  useEffect(() => {
    fetchCompanies(currentPage, limit);
  }, [currentPage, limit]);

  const fetchCompanies = async (page, lim) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/companies/companyWithPagination?page=${page}&limit=${lim}`
      );
      setCompanyList(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const addCompany = async () => {
    try {
      await axios.post(`${API_URL}/api/companies`, { companyName: company });
      toast.success("Company added successfully!");
      setCompany("");
      fetchCompanies(currentPage, limit); // refresh
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/companies/${id}`);
      toast.success("Company deleted successfully!");
      fetchCompanies(currentPage, limit);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const enableEdit = (index, currentName) => {
    setEditingIndex(index);
    setEditedCompanyName(currentName);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedCompanyName("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/companies/${id}`, {
        companyName: editedCompanyName,
      });
      toast.success("Company updated successfully!");
      fetchCompanies(currentPage, limit);
      cancelEdit();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <div className="flex flex-col p-5">
      <Toaster position="top-center" />

      <h2 className="font-bold mb-3">Company</h2>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Company Name"
          className="input input-bordered input-sm flex-1"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button className="btn btn-sm btn-primary" onClick={addCompany}>
          ADD
        </button>
      </div>

      {/* Limit Selector */}
      <div className="flex justify-end mb-2">
        <label className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            className="select select-bordered select-sm"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1); // 👈 reset to page 1 on limit change
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companyList.map((item, index) => (
              <tr key={item._id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editedCompanyName}
                      onChange={(e) => setEditedCompanyName(e.target.value)}
                      className="input input-bordered input-xs"
                    />
                  ) : (
                    item.companyName
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <>
                      <button
                        className="btn btn-success btn-xs mr-2"
                        onClick={() => saveEdit(item._id)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={cancelEdit}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-xs mr-2"
                        onClick={() => enableEdit(index, item.companyName)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => deleteCompany(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center ">
        <div className="join">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`join-item btn btn-sm  ${
                currentPage === i + 1 ? "btn-active btn-primary" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Company;
