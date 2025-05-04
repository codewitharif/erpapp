import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const SendMessage = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;

  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSend = (e) => {
  //   e.preventDefault();
  //   // Handle send message logic here
  //   console.log(
  //     "Message Sent to:",
  //     selectedCustomers.length ? selectedCustomers : formData.recipient
  //   );
  //   console.log("Message Details:", formData);
  //   // Reset form after sending
  //   setFormData({ recipient: "", subject: "", message: "" });
  //   setSelectedCustomers([]);
  // };

  const handleSend = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        subject: formData.subject,
        message: formData.message,
        recipients: selectedCustomers,
        sendToAll: selectedCustomers.length === customers.length,
      };

      await axios.post(`${API_URL}/api/customers/send`, payload);

      toast.success("Message sent successfully!");

      //alert("Message sent successfully!");
      setFormData({ recipient: "", subject: "", message: "" });
      setSelectedCustomers([]);
    } catch (error) {
      console.error("Sending failed:", error);
      alert("Failed to send message. Check console for details.");
    }
  };

  const handleCancel = () => {
    setFormData({ recipient: "", subject: "", message: "" });
    setSelectedCustomers([]);
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(
        selectedCustomers.filter((customerId) => customerId !== id)
      );
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map((customer) => customer._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/customers`)
      .then((response) => setCustomers(response.data))
      .catch((error) =>
        console.log("getting errors in fetching customers ", error)
      );
  }, []);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-base-200 p-2 gap-4">
      {/* Toast Notifications */}
      <Toaster position="top-center" />
      {/* Left Side - Form */}
      <div className="bg-base-100 p-4 rounded-lg shadow-lg w-full lg:w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Customer Messaging Center
        </h2>
        <form onSubmit={handleSend}>
          {/* Recipient Field */}
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-sm">Recipient</span>
            </label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className="input input-sm input-bordered "
              placeholder="Single recipient"
              disabled={selectedCustomers.length > 0}
              required
            />
          </div>

          {/* Subject Field */}
          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-sm">Subject</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input input-sm input-bordered"
              placeholder="Subject"
              required
            />
          </div>

          {/* Message Field */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-sm">Message</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="textarea textarea-sm textarea-bordered  h-24"
              placeholder="Message content"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-xs flex items-center gap-1"
              onClick={handleCancel}
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-xs flex items-center gap-1"
            >
              <FaPaperPlane />
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Table */}
      <div className="bg-base-100 p-4 rounded-lg shadow-lg w-full lg:w-2/3 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select Customers
        </h2>
        <table className="table table-xs">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    onChange={handleSelectAll}
                    checked={selectedCustomers.length === customers.length}
                  />
                </label>
              </th>
              <th>Name</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedCustomers.includes(customer._id)}
                      onChange={() => handleSelectCustomer(customer._id)}
                    />
                  </label>
                </td>
                <td>{customer.full_name}</td>
                <td>{customer.contact_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SendMessage;
