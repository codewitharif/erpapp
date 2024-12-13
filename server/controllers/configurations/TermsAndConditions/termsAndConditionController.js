const TermsAndCondition = require("../../../models/configurations/TermsAndConditions/termsAndConditionModel");

// Add new terms and conditions
exports.addTerms = async (req, res) => {
  try {
    const { terms } = req.body;

    const newTerms = new TermsAndCondition({ terms });
    await newTerms.save();

    res
      .status(201)
      .json({
        message: "Terms and Conditions added successfully",
        data: newTerms,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding Terms and Conditions", error });
  }
};

// Get all terms and conditions
exports.getAllTerms = async (req, res) => {
  try {
    const termsList = await TermsAndCondition.find();
    res.status(200).json(termsList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Terms and Conditions", error });
  }
};

// Get terms and conditions by ID
exports.getTermsById = async (req, res) => {
  try {
    const terms = await TermsAndCondition.findById(req.params.id);
    if (!terms) {
      return res
        .status(404)
        .json({ message: "Terms and Conditions not found" });
    }
    res.status(200).json(terms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Terms and Conditions", error });
  }
};

// Update terms and conditions by ID
exports.updateTermsById = async (req, res) => {
  try {
    const { terms } = req.body;
    const updatedTerms = await TermsAndCondition.findByIdAndUpdate(
      req.params.id,
      { terms },
      { new: true }
    );
    if (!updatedTerms) {
      return res
        .status(404)
        .json({ message: "Terms and Conditions not found" });
    }
    res
      .status(200)
      .json({
        message: "Terms and Conditions updated successfully",
        data: updatedTerms,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Terms and Conditions", error });
  }
};

// Delete terms and conditions by ID
exports.deleteTermsById = async (req, res) => {
  try {
    const deletedTerms = await TermsAndCondition.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTerms) {
      return res
        .status(404)
        .json({ message: "Terms and Conditions not found" });
    }
    res
      .status(200)
      .json({ message: "Terms and Conditions deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Terms and Conditions", error });
  }
};
