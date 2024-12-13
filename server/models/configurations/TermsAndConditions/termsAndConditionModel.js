const mongoose = require("mongoose");

const termsAndConditionSchema = new mongoose.Schema(
  {
    terms: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const TermsAndCondition = mongoose.model(
  "TermsAndCondition",
  termsAndConditionSchema
);

module.exports = TermsAndCondition;
