import React, { useState } from "react";
import Company from "./Company";
import BankAccount from "./BankAccount";
import TermsAndCondition from "./TermsAndCondition";
import Transport from "./Transport";

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("company"); // Default to 'receipt'
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-base-200 p-4 h-full">
        <ul className="menu space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("company")}
              className={`menu-item w-full text-left p-2 ${
                activeTab === "company" ? "bg-base-300" : ""
              }`}
            >
              Company
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("bank")}
              className={`menu-item w-full text-left p-2 ${
                activeTab === "bank" ? "bg-base-300" : ""
              }`}
            >
              Bank Account
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("transport")}
              className={`menu-item w-full text-left p-2 ${
                activeTab === "transport" ? "bg-base-300" : ""
              }`}
            >
              Transport
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("terms")}
              className={`menu-item w-full text-left p-2 ${
                activeTab === "terms" ? "bg-base-300" : ""
              }`}
            >
              Terms & Condition
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-4 bg-base-100">
        {/* Render the heading based on activeTab */}
        {activeTab === "company" && <Company />}

        {activeTab === "bank" && <BankAccount />}
        {activeTab === "transport" && <Transport />}
        {activeTab === "terms" && <TermsAndCondition />}
      </main>
    </div>
  );
};

export default Configuration;
