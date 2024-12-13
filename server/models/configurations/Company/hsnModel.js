const mongoose = require("mongoose");

const hsnSchema = new mongoose.Schema(
  {
    hsn: {
      type: String,
      required: true,
    },
    hsnDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const Hsn = mongoose.model("Hsn", hsnSchema);

module.exports = Hsn;
