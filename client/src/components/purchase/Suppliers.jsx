import React, { useState } from "react";
import AddSupplier from "./AddSupplier";
import SupplierItems from "./SupplierItems";

const Suppliers = () => {
  const [activeTab, setActiveTab] = useState("suppliers"); // Default to 'receipt'
  return (
    <div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-1/4 h-screen bg-base-200 p-4">
          <ul className="menu space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("suppliers")}
                className={`menu-item w-full text-left p-2 ${
                  activeTab === "suppliers" ? "bg-base-300" : ""
                }`}
              >
                Suppliers
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("suppliersitems")}
                className={`menu-item w-full text-left p-2 ${
                  activeTab === "suppliersitems" ? "bg-base-300" : ""
                }`}
              >
                supplier Items
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-4 bg-base-100">
          {/* Render the heading based on activeTab */}
          {activeTab === "suppliers" && <AddSupplier />}

          {activeTab === "suppliersitems" && <SupplierItems />}
        </main>
      </div>
    </div>
  );
};

export default Suppliers;
