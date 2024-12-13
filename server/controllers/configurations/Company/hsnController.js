const Hsn = require("../../../models/configurations/Company/hsnModel");

// Add a new HSN
exports.addHsn = async (req, res) => {
  try {
    const { hsn, hsnDescription } = req.body;

    const newHsn = new Hsn({ hsn, hsnDescription });
    await newHsn.save();

    res.status(201).json({ message: "HSN added successfully", data: newHsn });
  } catch (error) {
    res.status(500).json({ message: "Error adding HSN", error });
  }
};

// Get all HSNs
exports.getAllHsns = async (req, res) => {
  try {
    const hsns = await Hsn.find();
    res.status(200).json(hsns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching HSNs", error });
  }
};

// Get an HSN by ID
exports.getHsnById = async (req, res) => {
  try {
    const hsn = await Hsn.findById(req.params.id);
    if (!hsn) {
      return res.status(404).json({ message: "HSN not found" });
    }
    res.status(200).json(hsn);
  } catch (error) {
    res.status(500).json({ message: "Error fetching HSN", error });
  }
};

// Update an HSN by ID
exports.updateHsnById = async (req, res) => {
  try {
    const { hsn, hsnDescription } = req.body;
    const updatedHsn = await Hsn.findByIdAndUpdate(
      req.params.id,
      { hsn, hsnDescription },
      { new: true }
    );
    if (!updatedHsn) {
      return res.status(404).json({ message: "HSN not found" });
    }
    res
      .status(200)
      .json({ message: "HSN updated successfully", data: updatedHsn });
  } catch (error) {
    res.status(500).json({ message: "Error updating HSN", error });
  }
};

// Delete an HSN by ID
exports.deleteHsnById = async (req, res) => {
  try {
    const deletedHsn = await Hsn.findByIdAndDelete(req.params.id);
    if (!deletedHsn) {
      return res.status(404).json({ message: "HSN not found" });
    }
    res.status(200).json({ message: "HSN deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting HSN", error });
  }
};
