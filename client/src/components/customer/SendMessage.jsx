import React, { useState } from "react";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

const SendMessage = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers] = useState([
    { id: 1, name: "John Doe", mobile: "1234567890" },
    { id: 2, name: "Jane Smith", mobile: "0987654321" },
    { id: 3, name: "Alice Johnson", mobile: "1231231234" },
    { id: 4, name: "Bob Brown", mobile: "4564564567" },
    { id: 5, name: "Charlie Davis", mobile: "7897897890" },
    { id: 6, name: "David Wilson", mobile: "2342342345" },
    { id: 7, name: "Eve Miller", mobile: "5675675678" },
    { id: 8, name: "Frank Thomas", mobile: "6786786789" },
    { id: 9, name: "Grace Lee", mobile: "3453453456" },
    { id: 10, name: "Hank Adams", mobile: "8768768765" },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = (e) => {
    e.preventDefault();
    // Handle send message logic here
    console.log(
      "Message Sent to:",
      selectedCustomers.length ? selectedCustomers : formData.recipient
    );
    console.log("Message Details:", formData);
    // Reset form after sending
    setFormData({ recipient: "", subject: "", message: "" });
    setSelectedCustomers([]);
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
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen bg-base-200 p-2 gap-4">
      {/* Left Side - Form */}
      <div className="bg-base-100 p-4 rounded-lg shadow-lg w-full lg:w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center">Send Message</h2>
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
              <tr key={customer.id}>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                    />
                  </label>
                </td>
                <td>{customer.name}</td>
                <td>{customer.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SendMessage;
