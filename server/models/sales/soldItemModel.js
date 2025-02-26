const mongoose = require("mongoose");

const soldItemSchema = new mongoose.Schema({
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
      rate: { type: Number, required: true },
      discountPercent: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      netRate: { type: Number, required: true, default: 0 },
      gstPercent: { type: Number, required: true },
      gstAmount: { type: Number, required: true },
      quantity: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      uom: { type: String, required: true },
    },
  ],
});

const SoldItem = mongoose.model("SoldItem", soldItemSchema);

module.exports = SoldItem;
