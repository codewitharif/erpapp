const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema(
  {
    transporter: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },

    vehicleNo: {
      type: String,
      required: true,
    },
    fromTo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const Transport = mongoose.model("Transport", transportSchema);

module.exports = Transport;
