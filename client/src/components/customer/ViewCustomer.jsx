import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";

const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

const ViewCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchCity, setSearchCity] = useState("");

  // const fetchCustomers = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/api/customers`);
  //     setCustomers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching customers:", error);
  //   }
  // };

  const fetchCustomers = async (name = "", mobile = "", city = "") => {
    try {
      const params = {};
      if (name) params.name = name;
      if (mobile) params.mobile = mobile;
      if (city) params.city = city;

      const response = await axios.get(`${API_URL}/api/customers`, { params });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customers/search`, {
        params: {
          name: searchName,
          contact_no: searchContact,
          city: searchCity,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  };

  const handleEditClick = (id) => {
    console.log("our id is ", id);
    setEditingRow(id);
    const customer = customers.find((customer) => customer._id === id);
    setEditableData({ ...customer });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = async (customerId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/customers/${customerId}`,
        editableData
      );
      const updatedCustomers = customers.map((customer) =>
        customer._id === customerId ? response.data : customer
      );
      setCustomers(updatedCustomers);
      setEditingRow(null);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditableData({});
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/customers/${id}`);
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Customers List</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Customer Name:</label>
          <input
            type="text"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter customer name"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              fetchCustomers(e.target.value, searchContact, searchCity);
            }}
          />
        </div>
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Mobile No:</label>
          <input
            type="text"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter mobile number"
            value={searchContact}
            onChange={(e) => {
              setSearchContact(e.target.value);
              fetchCustomers(searchName, e.target.value, searchCity);
            }}
          />
        </div>
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">City:</label>
          <input
            type="text"
            className="input input-bordered input-sm w-full sm:w-40"
            placeholder="Enter city"
            value={searchCity}
            onChange={(e) => {
              setSearchCity(e.target.value);
              fetchCustomers(searchName, searchContact, e.target.value);
            }}
          />
        </div>
        <button
          className="btn btn-primary btn-sm w-full sm:w-auto"
          onClick={handleSearch}
        >
          <FaSearch />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs ">
          <thead>
            <tr>
              <th className="w-12">S.No</th>
              <th className="w-40 text-left">Name</th>
              <th className="w-64 text-left">Address</th>
              <th className="w-32 text-left">City</th>
              <th className="w-40 text-left">Contact No</th>
              <th className="w-40 text-left">GSTIN</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer._id}>
                <td>{index + 1}</td>
                {editingRow === customer._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="full_name"
                        value={editableData.full_name || ""}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="address"
                        value={editableData.address || ""}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="city"
                        value={editableData.city || ""}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contact_no"
                        value={editableData.contact_no || ""}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="gstin"
                        value={editableData.gstin || ""}
                        onChange={handleFormChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{customer.full_name}</td>
                    <td>{customer.address}</td>
                    <td>{customer.city}</td>
                    <td>{customer.contact_no}</td>
                    <td>{customer.gstin}</td>
                  </>
                )}
                <td>
                  {editingRow === customer._id ? (
                    <>
                      <button
                        className="btn btn-success btn-xs mr-2"
                        onClick={() => handleSaveClick(customer._id)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={handleCancelClick}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-xs mr-2"
                        onClick={() => handleEditClick(customer._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDeleteClick(customer._id)}
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
  );
};

export default ViewCustomer;
