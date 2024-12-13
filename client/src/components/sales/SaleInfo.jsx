import React, { useState } from "react";
import CustomerSoldItems from "./CustomerSoldItems";
import ItemsSales from "./ItemsSales";

const SaleInfo = () => {
  const [activeTab, setActiveTab] = useState("customers"); // Default to 'receipt'
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
          {activeTab === "customers" && <CustomerSoldItems />}

          {activeTab === "items" && <ItemsSales />}
        </main>
      </div>
    </div>
  );
};

export default SaleInfo;
