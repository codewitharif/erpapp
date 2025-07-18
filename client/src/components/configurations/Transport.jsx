import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { TiTick } from "react-icons/ti";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Import icons
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Footer";

const Transport = () => {
  const [transportData, setTransportData] = useState([]);
  const [formData, setFormData] = useState({
    transporter: "",
    contactName: "",
    contactNo: "",
    vehicleNo: "",
    fromTo: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5); // 👈 select box ke liye state

  // Fetch transport data from API
  const fetchTransportData = async (page, lim) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/transports/getAllTransportsWithPagination?page=${page}&limit=${lim}`
      );
      setTransportData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transport data:", error);
    }
  };

  // Call fetchTransportData when the component mounts
  useEffect(() => {
    fetchTransportData(currentPage, limit);
  }, [currentPage, limit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (index) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/transports/${editRowData._id}`,
        editRowData
      );

      // Update transport data
      const updatedData = [...transportData];
      updatedData[index] = response.data;
      setTransportData(updatedData);
      toast.success("Transport data updated successfully!");

      fetchTransportData();

      // Reset edit state
      setEditIndex(null);
      setEditRowData({}); // Clear editRowData after saving
    } catch (error) {
      console.error("Error updating transport data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/transports`, formData);
      setTransportData([...transportData, response.data]);
      toast.success("Transport data added successfully!");
      // Optionally, clear form fields after successful submission
      fetchTransportData();
      setFormData({
        transporter: "",
        contactName: "",
        contactNo: "",
        vehicleNo: "",
        fromTo: "",
      });
    } catch (error) {
      console.error("Error adding transport data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transports/${id}`);
      toast.success("Transport data deleted successfully!");
      setTransportData(transportData.filter((data) => data._id !== id));
    } catch (error) {
      console.error("Error deleting transport data:", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditRowData(transportData[index]); // Preload current row data for editing
  };

  const handleCancelEdit = () => {
    setEditIndex(null); // Reset edit mode
  };

  return (
    <>
      <div className="p-6">
        <Toaster position="top-center" />
        <h1 className="text-2xl font-bold mb-6">Transport</h1>

        {/* Form Section */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="form-control ">
            <label className="label">
              <span className="label-text">Transporter</span>
            </label>
            <input
              type="text"
              name="transporter"
              value={formData.transporter}
              onChange={handleChange}
              className="input input-bordered input-sm"
              placeholder="Enter transporter"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Contact Name</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="input input-bordered input-sm"
              placeholder="Enter contact name"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Contact No.</span>
            </label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className="input input-bordered input-sm"
              placeholder="Enter contact no."
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Vehicle No.</span>
            </label>
            <input
              type="text"
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleChange}
              className="input input-bordered input-sm"
              placeholder="Enter vehicle no."
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">From/To</span>
            </label>
            <input
              type="text"
              name="fromTo"
              value={formData.fromTo}
              onChange={handleChange}
              className="input input-bordered input-sm"
              placeholder="Enter from/to"
            />
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
              ADD
            </button>
          </div>
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

        {/* Table Section */}
        <div className=" overflow-x-auto ">
          <table className="table table-xs w-full mb-10">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Transporter</th>
                <th>Contact Name</th>
                <th>Contact No.</th>
                <th>Vehicle No.</th>
                <th>From/To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transportData.map((data, index) => (
                <tr key={data._id}>
                  <td>{index + 1}</td>
                  {editIndex === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="transporter"
                          value={editRowData.transporter}
                          onChange={handleEditChange}
                          className="input input-bordered input-xs w-auto"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="contactName"
                          value={editRowData.contactName}
                          onChange={handleEditChange}
                          className="input input-bordered input-xs w-auto "
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="contactNo"
                          value={editRowData.contactNo}
                          onChange={handleEditChange}
                          className="input input-bordered input-xs w-24 "
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="vehicleNo"
                          value={editRowData.vehicleNo}
                          onChange={handleEditChange}
                          className="input input-bordered input-xs w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="fromTo"
                          value={editRowData.fromTo}
                          onChange={handleEditChange}
                          className="input input-bordered input-xs w-auto"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-xs mr-2"
                          onClick={() => handleSave(index)}
                        >
                          <TiTick />
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={handleCancelEdit}
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{data.transporter}</td>
                      <td>{data.contactName}</td>
                      <td>{data.contactNo}</td>
                      <td>{data.vehicleNo}</td>
                      <td>{data.fromTo}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-xs mr-2"
                          onClick={() => handleEdit(index)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => handleDelete(data._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </>
                  )}
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
    </>
  );
};

export default Transport;
