import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Import icons

const Company = () => {
  // States for handling inputs and lists
  const [company, setCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [beat, setBeat] = useState("");
  const [beatList, setBeatList] = useState([]);
  const [hsn, setHsn] = useState({ code: "", description: "" });
  const [hsnList, setHsnList] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCompanyName, setEditedCompanyName] = useState("");

  // Base API URL
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  // Fetch initial data on component mount
  useEffect(() => {
    fetchCompanies();
    fetchBeats();
    fetchHsns();
  }, []);

  // GET requests to fetch lists from backend
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/companies`);
      setCompanyList(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchBeats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/beats`);
      setBeatList(response.data);
    } catch (error) {
      console.error("Error fetching beats:", error);
    }
  };

  const fetchHsns = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/hsn`);
      if (response.data && Array.isArray(response.data)) {
        setHsnList(response.data);
      }
    } catch (error) {
      console.error("Error fetching HSNs:", error);
    }
  };

  // POST requests to add new items to backend
  const addCompany = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/companies`, {
        companyName: company,
      });
      // setCompanyList([...companyList, response.data]);
      setCompanyList((prev) => [...prev, response.data]); // For additions
      setCompany("");
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/companies/${id}`);
      setCompanyList(companyList.filter((item) => item._id !== id));
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
      const response = await axios.put(`${API_URL}/api/companies/${id}`, {
        companyName: editedCompanyName,
      });
      const updatedCompanyList = [...companyList];
      updatedCompanyList[editingIndex].companyName = response.data.companyName;
      setCompanyList(updatedCompanyList);
      cancelEdit();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-5">
      {/* Company Section */}
      <div className="flex-1">
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
        <div className="overflow-x-auto">
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
                  <td>{index + 1}</td>
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
      </div>
    </div>
  );
};

export default Company;
