import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"; // Import icons

const BankAccount = () => {
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL;
  const [accountNo, setAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [branch, setBranch] = useState("");
  const [ifscCode, setIfscCode] = useState(""); // Changed variable name to 'ifscCode'

  const [bankAccounts, setBankAccounts] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // To track the row being edited
  const [editData, setEditData] = useState({}); // To store data during editing

  // Function to fetch bank accounts on component mount
  const fetchBankAccounts = async () => {
    const response = await fetch(`${API_URL}/api/bankAccounts`);
    const data = await response.json();
    setBankAccounts(data);
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const handleAddAccount = async () => {
    if (accountNo && bankName && accountName && branch && ifscCode) {
      const newAccount = {
        accountNo,
        bankName,
        accountName,
        branch,
        ifsc: ifscCode, // Adjusted to match the API structure
        openningBalance: "0.00", // Note: It’s best to check if this is correct
      };

      // Call the POST API to add the new account
      const response = await fetch(`${API_URL}/api/bankAccounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });

      if (response.ok) {
        const addedAccount = await response.json();
        setBankAccounts([...bankAccounts, addedAccount]);
        fetchBankAccounts();
        clearForm();
      } else {
        // Handle error (optional)
        console.error("Failed to add account");
      }
    }
  };

  const clearForm = () => {
    setAccountNo("");
    setBankName("");
    setAccountName("");
    setBranch("");
    setIfscCode("");
  };

  const handleDeleteAccount = async (index) => {
    const accountToDelete = bankAccounts[index];

    // Call the DELETE API if you implement it
    const response = await fetch(
      `${API_URL}/api/bankAccounts/${accountToDelete._id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
      setBankAccounts(updatedAccounts);
    } else {
      // Handle error (optional)
      console.error("Failed to delete account");
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData(bankAccounts[index]);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditData({});
  };

  const handleSaveEdit = async (index) => {
    const updatedAccounts = bankAccounts.map((account, i) =>
      i === index ? editData : account
    );

    // Call the PUT API if you implement it
    const response = await fetch(
      `${API_URL}/api/bankAccounts/${editData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      }
    );

    if (response.ok) {
      setBankAccounts(updatedAccounts);
      setEditIndex(null);
      setEditData({});
    } else {
      // Handle error (optional)
      console.error("Failed to update account");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add/Update Bank Account</h2>

      {/* Form Section */}

      <div className="flex flex-wrap items-end gap-4">
        <div className="form-control">
          <label className="label">Account No.</label>
          <input
            type="text"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Enter account no"
          />
        </div>
        <div className="form-control">
          <label className="label">Bank Name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Enter bank name"
          />
        </div>
        <div className="form-control">
          <label className="label">Account Name</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Enter account name"
          />
        </div>
        <div className="form-control">
          <label className="label">Branch</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Enter branch"
          />
        </div>
        <div className="form-control">
          <label className="label">IFSC Code</label>
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            className="input input-bordered input-sm"
            placeholder="Enter IFSC code"
          />
        </div>

        <div className="mt-1">
          <button className="btn btn-sm btn-primary" onClick={handleAddAccount}>
            Save
          </button>
        </div>
      </div>

      {/* Bank Account Table */}
      <h3 className="mt-8 text-xl font-semibold">
        Update Bank Current Balance
      </h3>
      <div className="overflow-x-auto mt-4">
        <table className="table table-xs">
          <thead>
            <tr className="bg-gray-200">
              <th>Account No.</th>
              <th>Bank Name</th>
              <th>Account Name</th>
              <th>Branch</th>
              <th>IFSC Code</th>
              <th>Opening Balance</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bankAccounts.map((account, index) => (
              <tr key={index}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editData.accountNo}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            accountNo: e.target.value,
                          })
                        }
                        className="input input-bordered input-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.bankName}
                        onChange={(e) =>
                          setEditData({ ...editData, bankName: e.target.value })
                        }
                        className="input input-bordered input-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.accountName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            accountName: e.target.value,
                          })
                        }
                        className="input input-bordered input-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.branch}
                        onChange={(e) =>
                          setEditData({ ...editData, branch: e.target.value })
                        }
                        className="input input-bordered input-xs"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.ifsc}
                        onChange={(e) =>
                          setEditData({ ...editData, ifsc: e.target.value })
                        }
                        className="input input-bordered input-xs"
                      />
                    </td>
                    <td>{editData.openningBalance}</td>
                    <td>{new Date(editData.createdAt).toLocaleString()}</td>
                    <td>{new Date(editData.updatedAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-info btn-xs mr-2"
                        onClick={() => handleSaveEdit(index)}
                      >
                        <FaSave />
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
                    <td>{account.accountNo}</td>
                    <td>{account.bankName}</td>
                    <td>{account.accountName}</td>
                    <td>{account.branch}</td>
                    <td>{account.ifsc}</td>
                    <td>{account.openningBalance}</td>
                    <td>{new Date(account.createdAt).toLocaleString()}</td>
                    <td>{new Date(account.updatedAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-xs mr-2"
                        onClick={() => handleEditClick(index)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-error btn-xs"
                        onClick={() => handleDeleteAccount(index)}
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
    </div>
  );
};

export default BankAccount;
