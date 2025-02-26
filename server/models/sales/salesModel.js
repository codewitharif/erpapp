const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoiceNo: {
      type: Number,
      required: true,
      unique: true,
    },
    soldItemsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SoldItem",
      required: true,
    },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    transportCharges: { type: Number, default: 0 },
    gstTotal: { type: Number, required: true },
    netTotal: { type: Number, required: true },
    cash: { type: Number, required: true, default: 0 },
    card: { type: Number, required: true, default: 0 },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: false,
      default: null,
    },
    balance: { type: Number, required: true },
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
      required: false,
      default: null,
    },
    remark: { type: String },
    saleDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
