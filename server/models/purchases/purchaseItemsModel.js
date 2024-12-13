const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const purchaseItemSchema = new Schema({
  items: [
    {
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyName",
        required: true,
      },
      itemCode: { type: String, required: true },
      itemName: { type: String, required: true },
      hsn: { type: String, required: true },
      rate: { type: Number, required: true, default: 0 },
      discountPercent: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      netRate: { type: Number, required: true, default: 0 },
      gstPercent: { type: Number, required: true, default: 0 },
      gstAmount: { type: Number, required: true, default: 0 },
      quantity: { type: Number, required: true, default: 0 },
      totalAmount: { type: Number, required: true, default: 0 },
      mrp: { type: Number, required: true, default: 0 },
    },
  ],
});

module.exports = mongoose.model("PurchaseItem", purchaseItemSchema);
