import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null); // Track open submenu

  const toggleMenu = (menuName) => {
    if (openMenu === menuName) {
      setOpenMenu(menuName); // Close if the same menu is clicked again
    } else {
      setOpenMenu(menuName); // Open the clicked menu and close others
    }
  };
  return (
    <div>
      <div className="navbar bg-base-100  ">
        <div className="navbar-start z-50">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <details>
                  <summary tabIndex={0}>Purchase</summary>
                  <ul className="p-2">
                    <li>
                      <Link to="addPurchase"> Add Purchase</Link>
                    </li>
                    <li>
                      <Link to="viewPurchase">View Purchase</Link>
                    </li>
                    <li>
                      <Link to="addSupplier">Add Supplier</Link>
                    </li>
                    <li>
                      <Link to="purchaseReport">Purchase Report</Link>
                    </li>
                    {/* <li>
                      <Link to="viewOrder">Purchase Info</Link>
                    </li> */}
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Sales</summary>
                  <ul className="p-2">
                    <li>
                      <Link to="addInvoice">New Invoice</Link>
                    </li>
                    <li>
                      <Link to="viewInvoice">View Invoicce</Link>
                    </li>

                    <li>
                      <Link to="saleReport">Sales Report</Link>
                    </li>
                    <li>
                      <Link to="saleInfo">Sale Info</Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Stocks</summary>
                  <ul className="p-2">
                    <li>
                      <Link to="addStocks">New Stock</Link>
                    </li>
                    <li>
                      <Link to="viewStocks">View Stock</Link>
                    </li>
                    <li>
                      <Link to="editStocks">Edit Stock</Link>
                    </li>
                    <li>
                      <Link to="availableStocks">Available Stock</Link>
                    </li>
                    <li>
                      <Link to="soldStocks">Sold Stock</Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details>
                  <summary>Customers</summary>
                  <ul tabIndex={0} className="p-2">
                    <li>
                      <Link to="addCustomer"> New Customer</Link>
                    </li>
                    <li>
                      <Link to="viewCustomer">View Customer</Link>
                    </li>
                    <li>
                      <Link to="sendMessage">Send Message</Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <Link to="/config">Configurations</Link>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">BizStrive</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="dropdown dropdown-hover">
              <summary tabIndex={0}>Purchase</summary>
              <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-56 z-50 p-2 pt-4 shadow">
                <li>
                  <Link to="addPurchase">Add Purchase</Link>
                </li>
                <li>
                  <Link to="viewPurchase">View Purchase</Link>
                </li>
                <li>
                  <Link to="addSupplier">Add Supplier</Link>
                </li>
                <li>
                  <Link to="purchaseReport">Purchase Report</Link>
                </li>
                {/* <li>
                  <Link to="viewOrder">Purchase Info</Link>
                </li> */}
              </ul>
            </li>

            <li className="dropdown dropdown-hover">
              <summary tabIndex={0}>Sales</summary>
              <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-56 z-50 p-2 pt-4 shadow">
                <li>
                  <Link to="addInvoice">New Invoice</Link>
                </li>
                <li>
                  <Link to="viewInvoice">View Invoice</Link>
                </li>

                <li>
                  <Link to="saleReport">Sales Report</Link>
                </li>
                <li>
                  <Link to="saleInfo">Sale Info</Link>
                </li>
              </ul>
            </li>

            <li className="dropdown dropdown-hover">
              <summary tabIndex={0}>Stocks</summary>
              <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-56 z-50 p-2 pt-4 shadow">
                <li>
                  <Link to="addStocks">New Stock</Link>
                </li>
                <li>
                  <Link to="viewStocks">View Stock</Link>
                </li>
                <li>
                  <Link to="editStocks">Edit Stock</Link>
                </li>
                <li>
                  <Link to="availableStocks">Available Stock</Link>
                </li>
                <li>
                  <Link to="soldStocks">Sold Stock</Link>
                </li>
              </ul>
            </li>

            <li className="dropdown dropdown-hover">
              <summary tabIndex={0}>Customers</summary>
              <ul className="dropdown-content menu menu-sm bg-base-200 rounded-box w-56 z-50 p-2 pt-4 shadow">
                <li>
                  <Link to="/addCustomer">New Customer</Link>
                </li>
                <li>
                  <Link to="/viewCustomer">View Customer</Link>
                </li>
                <li>
                  <Link to="/sendMessage">Send Message</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/config">Configurations</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end ">
          <label className="grid cursor-pointer place-items-center">
            <input
              type="checkbox"
              value="synthwave"
              className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
            />
            <svg
              className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <svg
              className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Navbar;
