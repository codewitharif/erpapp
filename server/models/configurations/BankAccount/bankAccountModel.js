const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema(
  {
    accountNo: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
    },
    openningBalance: {
      type: String,
      default: "0", // Sets the default value to "0"
      required: false, // This makes the field optional
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

module.exports = BankAccount;
