import React, { useState } from "react";
import AddSupplier from "./AddSupplier";
import SupplierItems from "./SupplierItems";

const Sales = () => {
  const [activeTab, setActiveTab] = useState("suppliers"); // Default to 'receipt'
  return (
    <div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-1/4 bg-base-200 p-4">
          <ul className="menu space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("customers")}
                className={`menu-item w-full text-left p-2 ${
                  activeTab === "customers" ? "bg-base-300" : ""
                }`}
              >
                Customer
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("items")}
                className={`menu-item w-full text-left p-2 ${
                  activeTab === "items" ? "bg-base-300" : ""
                }`}
              >
                Items
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-4 bg-base-100">
          {/* Render the heading based on activeTab */}
          {activeTab === "customers" && <AddSupplier />}

          {activeTab === "items" && <SupplierItems />}
        </main>
      </div>
    </div>
  );
};

export default Sales;
