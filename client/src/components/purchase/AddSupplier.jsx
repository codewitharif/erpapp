import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

const AddSupplier = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [suppliers, setsuppliers] = useState([]);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: "",
    contactNo: "",
    address: "",
    gstin: "",
    state: "",
  });
  const [editFormData, setEditFormData] = useState({
    supplierName: "",
    contactNo: "",
    address: "",
    gstin: "",
    state: "",
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/suppliers`)
      .then((response) => setsuppliers(response.data.suppliers))
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleNewSupplierChange = (event) => {
    const { name, value } = event.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const addSupplier = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/suppliers`,
        newSupplier
      );
      setsuppliers([...suppliers, response.data]);
      setNewSupplier({
        supplierName: "",
        contactNo: "",
        address: "",
        gstin: "",
        state: "",
      });
      console.log("Supplier added successfully.");
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  const handleEditClick = (supplierId) => {
    setEditSupplierId(supplierId);
    const editSupplier = suppliers.find(
      (supplier) => supplier._id === supplierId
    );
    if (editSupplier) {
      setEditFormData({
        supplierName: editSupplier.supplierName,
        contactNo: editSupplier.contactNo,
        address: editSupplier.address,
        gstin: editSupplier.gstin,
        state: editSupplier.state,
      });
    }
  };
  const handleSaveClick = async (supplierId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/suppliers/${supplierId}`,
        editFormData
      );
      const updatedSuppliers = suppliers.map((supplier) =>
        supplier._id === supplierId ? response.data : supplier
      );
      setsuppliers(updatedSuppliers);
      setEditSupplierId(null);
      console.log("Supplier updated successfully.");
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleCancelClick = () => {
    setEditSupplierId(null);
  };

  // const handleDeleteClick = (supplierId) => {
  //   console.log("deleting supplier is ", supplierId);
  //   const newSuppliers = suppliers.filter(
  //     (supplier) => supplier._id !== supplierId
  //   );
  //   setsuppliers(newSuppliers);
  // };
  const handleDeleteClick = async (supplierId) => {
    console.log("Deleting supplier with ID:", supplierId);

    try {
      // Make the DELETE request
      await axios.delete(`${API_URL}/api/suppliers/${supplierId}`);

      // Update the local state after successful deletion
      const newSuppliers = suppliers.filter(
        (supplier) => supplier._id !== supplierId
      );
      setsuppliers(newSuppliers);

      console.log("Supplier deleted successfully.");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      // Optionally handle error with a notification or alert
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add Supplier</h1>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Supplier Name:</label>
          <input
            type="text"
            name="supplierName"
            value={newSupplier.supplierName}
            onChange={handleNewSupplierChange}
            placeholder="Enter supplier name"
            className="input input-bordered input-sm w-full sm:w-40"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Contact No:</label>
          <input
            type="text"
            name="contactNo"
            value={newSupplier.contactNo}
            onChange={handleNewSupplierChange}
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            value={newSupplier.address}
            onChange={handleNewSupplierChange}
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter Address"
          />
        </div>
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">GSTIN:</label>
          <input
            type="text"
            name="gstin"
            value={newSupplier.gstin}
            onChange={handleNewSupplierChange}
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter GSTIN"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">State</label>
          <select
            name="state"
            value={newSupplier.state}
            onChange={handleNewSupplierChange}
            className="select select-bordered select-sm sm:w-auto"
          >
            <option value="Jharkhand">Jharkhand</option>
            <option value="Bihar">Bihar</option>
            <option value="Chattisgarh">Chattisgarh</option>
            <option value="Orrisa">Orrisa</option>
            <option value="Assam">Assam</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>

        <button
          onClick={addSupplier}
          className="btn btn-primary btn-sm w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th className="w-12">S.No</th>
              <th className="w-40 text-left">Name</th>
              <th className="w-40 text-left">Contact No</th>
              <th className="w-64 text-left">Address</th>
              <th className="w-40 text-left">GSTIN</th>
              <th className="w-40 text-left">State</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier._id}>
                <td>{index + 1}</td>
                {editSupplierId === supplier._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.supplierName}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contact"
                        value={editFormData.contactNo}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="address"
                        value={editFormData.address}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="gstin"
                        value={editFormData.gstin}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{supplier.supplierName}</td>
                    <td>{supplier.contactNo}</td>
                    <td>{supplier.address}</td>
                    <td>{supplier.gstin}</td>
                    <td>{supplier.state}</td>
                  </>
                )}
                <td>
                  {editSupplierId === supplier._id ? (
                    <>
                      <button
                        className="btn btn-success btn-xs mr-2"
                        onClick={() => handleSaveClick(supplier._id)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-warning btn-xs"
                        onClick={handleCancelClick}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-xs mr-2"
                        onClick={() => handleEditClick(supplier._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDeleteClick(supplier._id)}
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
      <div className="flex justify-center mt-4">
        <div className="join">
          <input
            className="join-item btn btn-square btn-sm"
            type="radio"
            name="options"
            aria-label="1"
            defaultChecked
          />
          <input
            className="join-item btn btn-square btn-sm"
            type="radio"
            name="options"
            aria-label="2"
          />
          <input
            className="join-item btn btn-square btn-sm"
            type="radio"
            name="options"
            aria-label="3"
          />
          <input
            className="join-item btn btn-square btn-sm"
            type="radio"
            name="options"
            aria-label="4"
          />
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;
