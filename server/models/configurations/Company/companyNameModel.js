const mongoose = require("mongoose");

const companyNameSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const CompanyName = mongoose.model("CompanyName", companyNameSchema);

module.exports = CompanyName;
