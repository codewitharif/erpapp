import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddCustomer = () => {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [gstin, setGstin] = useState("");
  const [email, setEmail] = useState("");

  // Base API URL
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const handleSave = async () => {
    const customerData = {
      full_name: fullName,
      address: address,
      city: city,
      contact_no: contact,
      gstin: gstin,
      email: email,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/customers`,
        customerData
      );
      console.log("Customer added:", response.data);
      toast.success("Customer added successfully!"); // Show success message

      // Optionally, clear form fields after successful submission
      handleNew();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleNew = () => {
    setFullName("");
    setAddress("");
    setCity("");
    setContact("");
    setGstin("");
    setEmail("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <div className="bg-base-100 p-4 rounded shadow-lg w-72">
        <h2 className="text-xl font-semibold text-center mb-3">Add Customer</h2>
        <div className="form-control mb-3">
          <label className="label text-sm">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input input-sm input-bordered w-full"
            placeholder="Full Name"
          />
        </div>
        <div className="form-control mb-3">
          <label className="label text-sm">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="textarea textarea-sm textarea-bordered w-full"
            rows={2}
            placeholder="Address"
          />
        </div>
        <div className="form-control mb-3">
          <label className="label text-sm">City/Village</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input input-sm input-bordered w-full"
            placeholder="City/Village"
          />
        </div>
        <div className="form-control mb-3">
          <label className="label text-sm">Contact No</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="input input-sm input-bordered w-full"
            placeholder="Contact No"
          />
        </div>
        <div className="form-control mb-3">
          <label className="label text-sm">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-sm input-bordered w-full"
            placeholder="Email ID"
          />
        </div>
        <div className="form-control mb-4">
          <label className="label text-sm">GSTIN</label>
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="input input-sm input-bordered w-full"
            placeholder="GSTIN"
          />
        </div>
        <div className="flex justify-center space-x-2">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            SAVE
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleNew}>
            NEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
