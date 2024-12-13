const express = require("express");
const router = express.Router();
const companyNameController = require("../../../controllers/configurations/Company/companyNameController");

// Route to add a new company
router.post("/", companyNameController.addCompanyName);

// Route to get all companies
router.get("/", companyNameController.getAllCompanies);

// Route to get a company by ID
router.get("/:id", companyNameController.getCompanyById);

// Route to update a company by ID
router.put("/:id", companyNameController.updateCompanyById);

// Route to delete a company by ID
router.delete("/:id", companyNameController.deleteCompanyById);

module.exports = router;
