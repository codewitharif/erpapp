const mongoose = require("mongoose");

const stocksSchema = new mongoose.Schema(
  {
    itemcode: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companynames",
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    itemDescription: {
      type: String,
      required: true,
    },
    hsn: {
      type: String,
      required: false, // Optional field
    },
    gstinpercent: {
      type: Number, // Assuming this represents a percentage
      required: false, // Optional
    },
    qty: {
      type: Number, // Quantity should be a number
      required: false, // Optional
    },
    mrpinrs: {
      type: Number, // MRP in INR should be a number
      required: false, // Optional
    },
    cpinrs: {
      type: Number, // Cost price in INR should be a number
      required: false, // Optional
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Stocks", stocksSchema);
