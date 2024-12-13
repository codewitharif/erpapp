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
    paymentMethod: { type: String, required: true },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: false,
    },
    balance: { type: Number, required: true },
    purchaseOrderNo: { type: String },
    remark: { type: String },
    saleDate: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
