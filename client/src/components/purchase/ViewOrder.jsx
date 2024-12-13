import React from "react";
import { FaSearch } from "react-icons/fa";

const ViewOrder = () => {
  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">Supplier:</label>
          <select className="select select-bordered select-sm w-full lg:w-32">
            <option>-All-</option>
            <option>Supplier 1</option>
            <option>Supplier 2</option>
          </select>
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">From:</label>
          <input
            type="date"
            className="input input-bordered input-sm w-full lg:w-32"
          />
        </div>

        <div className="form-control w-full sm:w-auto">
          <label className="font-semibold">To:</label>
          <input
            type="date"
            className="input input-bordered input-sm w-full lg:w-32"
          />
        </div>

        <button className="btn btn-primary btn-sm w-full sm:w-auto">
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default ViewOrder;
