const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Purchase
const purchaseSchema = new Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    purchaseDate: { type: Date, required: true },
    billNo: { type: String, required: true },
    totalAmount: { type: Number, required: true, default: 0 },
    gstTotal: { type: Number, required: true, default: 0 },
    otherCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    netTotal: { type: Number, required: true, default: 0 },
    balance: { type: Number, default: 0 },
    cash: { type: Number, default: 0 },
    card: { type: Number, default: 0 },
    cheque: { type: Number, default: 0 },
    chequeNo: { type: String, default: "" },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
      required: false,
    },
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
      required: false,
    },
    remark: { type: String, default: "" },
    purchaseItemsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseItem", // Reference to the PurchaseItem collection
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
