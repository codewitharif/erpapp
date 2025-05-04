const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  contact_no: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
