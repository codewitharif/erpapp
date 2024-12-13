const mongoose = require("mongoose");

// Schema for Supplier
const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    gstin: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true } // Add timestamps (createdAt, updatedAt)
);

// Export Supplier model
module.exports = mongoose.model("Supplier", supplierSchema);
