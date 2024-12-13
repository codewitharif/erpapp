const Transport = require("../../../models/configurations/Transport/transportModel");

// Add a new transport entry
exports.addTransport = async (req, res) => {
  try {
    const { transporter, contactName, contactNo, vehicleNo, fromTo } = req.body;

    const newTransport = new Transport({
      transporter,
      contactName,
      contactNo,
      vehicleNo,
      fromTo,
    });

    await newTransport.save();

    res.status(201).json({
      message: "Transport entry added successfully",
      data: newTransport,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding transport entry", error });
  }
};

// Get all transport entries
exports.getAllTransports = async (req, res) => {
  try {
    const transports = await Transport.find();
    res.status(200).json(transports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transport entries", error });
  }
};

// Get a transport entry by ID
exports.getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: "Transport entry not found" });
    }
    res.status(200).json(transport);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transport entry", error });
  }
};

// Update a transport entry by ID
exports.updateTransportById = async (req, res) => {
  try {
    const { transporter, contactName, contactNo, vehicleNo, fromTo } = req.body;

    const updatedTransport = await Transport.findByIdAndUpdate(
      req.params.id,
      { transporter, contactName, contactNo, vehicleNo, fromTo },
      { new: true }
    );

    if (!updatedTransport) {
      return res.status(404).json({ message: "Transport entry not found" });
    }
    res.status(200).json({
      message: "Transport entry updated successfully",
      data: updatedTransport,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating transport entry", error });
  }
};

// Delete a transport entry by ID
exports.deleteTransportById = async (req, res) => {
  try {
    const deletedTransport = await Transport.findByIdAndDelete(req.params.id);
    if (!deletedTransport) {
      return res.status(404).json({ message: "Transport entry not found" });
    }
    res.status(200).json({ message: "Transport entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transport entry", error });
  }
};
