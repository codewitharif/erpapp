const BeatName = require("../../../models/configurations/Company/beatNameModel");

// Add a new beat
exports.addBeatName = async (req, res) => {
  try {
    const { beatName } = req.body;

    const newBeat = new BeatName({ beatName });
    await newBeat.save();

    res
      .status(201)
      .json({ message: "Beat name added successfully", data: newBeat });
  } catch (error) {
    res.status(500).json({ message: "Error adding beat name", error });
  }
};

// Get all Beat
exports.getAllBeats = async (req, res) => {
  try {
    const beats = await BeatName.find();
    res.status(200).json(beats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beats", error });
  }
};

// Get a beat by ID
exports.getBeatById = async (req, res) => {
  try {
    const beat = await BeatName.findById(req.params.id);
    if (!beat) {
      return res.status(404).json({ message: "Beat not found" });
    }
    res.status(200).json(beat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching beat", error });
  }
};

// Update a beat by ID
exports.updateBeatById = async (req, res) => {
  try {
    const updatedBeat = await BeatName.findByIdAndUpdate(
      req.params.id,
      { beatName: req.body.BeatName },
      { new: true }
    );
    if (!updatedBeat) {
      return res.status(404).json({ message: "Beat not found" });
    }
    res
      .status(200)
      .json({ message: "Beat updated successfully", data: updatedBeat });
  } catch (error) {
    res.status(500).json({ message: "Error updating beat", error });
  }
};

// Delete a beat by ID
exports.deleteBeatById = async (req, res) => {
  try {
    const deletedBeat = await BeatName.findByIdAndDelete(req.params.id);
    if (!deletedBeat) {
      return res.status(404).json({ message: "Beat not found" });
    }
    res.status(200).json({ message: "Beat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting beat", error });
  }
};
