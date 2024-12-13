const express = require("express");
const router = express.Router();
const termsAndConditionController = require("../../../controllers/configurations/TermsAndConditions/termsAndConditionController");

// Route to add new terms and conditions
router.post("/", termsAndConditionController.addTerms);

// Route to get all terms and conditions
router.get("/", termsAndConditionController.getAllTerms);

// Route to get terms and conditions by ID
router.get("/:id", termsAndConditionController.getTermsById);

// Route to update terms and conditions by ID
router.put("/:id", termsAndConditionController.updateTermsById);

// Route to delete terms and conditions by ID
router.delete("/:id", termsAndConditionController.deleteTermsById);

module.exports = router;
