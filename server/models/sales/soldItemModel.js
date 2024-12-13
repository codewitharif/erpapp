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
      mrp: { type: Number, required: true },
      discountPercent: { type: Number, default: 0 },
      discountValue: { type: Number, default: 0 },
      rate: { type: Number, required: true },
      gstPercent: { type: Number, required: true },
      gstValue: { type: Number, required: true },
      qty: { type: Number, required: true },
      total: { type: Number, required: true },
      uom: { type: String, required: true },
    },
  ],
});

const SoldItem = mongoose.model("SoldItem", soldItemSchema);

module.exports = SoldItem;
