import React, { useState, useEffect } from "react";
import axios from "axios";

const Company = () => {
  // States for handling inputs and lists
  const [company, setCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [beat, setBeat] = useState("");
  const [beatList, setBeatList] = useState([]);
  const [hsn, setHsn] = useState({ code: "", description: "" });
  const [hsnList, setHsnList] = useState([]);

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
      setCompanyList([...companyList, response.data]);
      setCompany("");
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const addBeat = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/beats`, {
        beatName: beat,
      });
      setBeatList([...beatList, response.data]);
      setBeat("");
    } catch (error) {
      console.error("Error adding beat:", error);
    }
  };

  const addHsn = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/hsn`, {
        hsn: hsn.code,
        hsnDescription: hsn.description,
      });
      setHsnList((prevHsnList) => [...prevHsnList, response.data.data]);
      // setHsnList([...hsnList, response.data]);
      setHsn({ code: "", description: "" });
    } catch (error) {
      console.error("Error adding HSN:", error);
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
              </tr>
            </thead>
            <tbody>
              {companyList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.companyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beat Section */}
      <div className="flex-1">
        <h2 className="font-bold mb-3">BEAT</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Beat Name"
            className="input input-bordered input-sm flex-1"
            value={beat}
            onChange={(e) => setBeat(e.target.value)}
          />
          <button className="btn btn-sm btn-primary" onClick={addBeat}>
            ADD
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Beat</th>
              </tr>
            </thead>
            <tbody>
              {beatList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.beatName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HSN Section */}
      <div className="flex-1">
        <h2 className="font-bold mb-3">HSN</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="HSN"
            className="input input-bordered input-sm flex-1"
            value={hsn.code}
            onChange={(e) => setHsn({ ...hsn, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="input input-bordered input-sm flex-1"
            value={hsn.description}
            onChange={(e) => setHsn({ ...hsn, description: e.target.value })}
          />
          <button className="btn btn-sm btn-primary" onClick={addHsn}>
            ADD
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>HSN</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {hsnList.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.hsn}</td>
                  <td>{item.hsnDescription}</td>
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
