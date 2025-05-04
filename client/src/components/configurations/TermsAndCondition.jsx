import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // Importing the trash icon for delete
import toast, { Toaster } from "react-hot-toast";

const TermsAndCondition = () => {
  const [terms, setTerms] = useState([]);
  const [newTerm, setNewTerm] = useState("");

  // Base API URL
  const API_URL = import.meta.env.VITE_BACKEND_BASE_API_URL; // Ensure this is correctly set in your .env file

  // Fetch existing terms on component mount
  useEffect(() => {
    fetchTerms();
  }, []);

  // GET request to fetch terms from the backend
  const fetchTerms = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/terms`);
      setTerms(response.data); // Set terms using the response data
    } catch (error) {
      console.error("Error fetching terms:", error);
    }
  };

  // POST request to add a new term
  const handleAddTerm = async () => {
    if (newTerm.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/api/terms`, {
          terms: newTerm,
        });
        console.log("New term added:", response.data); // Log response for debugging
        toast.success("New terms added successfully!"); // Show success message

        setTerms((prevTerms) => [...prevTerms, response.data.data]); // Add the new term
        //setTerms([...terms, response.data]); // Add new term from response
        // fetchTerms();
        setNewTerm(""); // Clear the input field
      } catch (error) {
        console.error("Error adding term:", error);
      }
    }
  };

  // DELETE request to remove a term
  const handleDeleteTerm = async (index) => {
    const termToDelete = terms[index];
    try {
      await axios.delete(`${API_URL}/api/terms/${termToDelete._id}`); // Use '_id' to delete
      toast.success("Term deleted successfully!"); // Show success message

      const updatedTerms = terms.filter((_, i) => i !== index);
      setTerms(updatedTerms);
    } catch (error) {
      console.error("Error deleting term:", error);
    }
  };

  return (
    <div className="p-4">
      <Toaster position="top-center" /> {/* Toast notifications */}
      <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
      {/* Add New Term Section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
          className="input input-sm input-bordered w-full"
          placeholder="Add New Term"
        />
        <button className="btn btn-sm btn-primary" onClick={handleAddTerm}>
          ADD
        </button>
      </div>
      {/* Terms Table */}
      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border rounded">
        <table className="table table-xs border-collapse  border-gray-300max-h-[60vh] overflow-y-auto border rounded ">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Sr.</th>
              <th className="border border-gray-300 p-2">Terms & Conditions</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term, index) => (
              <tr key={term._id}>
                {" "}
                {/* Ensure unique key is used here */}
                <td className="border border-gray-300 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-2">{term.terms}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => handleDeleteTerm(index)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {terms.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-2">
                  No terms available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TermsAndCondition;
