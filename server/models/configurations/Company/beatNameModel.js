const mongoose = require("mongoose");

const beatNameSchema = new mongoose.Schema(
  {
    beatName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

const BeatName = mongoose.model("BeatName", beatNameSchema);

module.exports = BeatName;
