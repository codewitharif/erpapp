const express = require("express");
const router = express.Router();
const hsnController = require("../../../controllers/configurations/Company/hsnController");

// Route to add a new HSN
router.post("/", hsnController.addHsn);

// Route to get all HSNs
router.get("/", hsnController.getAllHsns);

// Route to get an HSN by ID
router.get("/:id", hsnController.getHsnById);

// Route to update an HSN by ID
router.put("/:id", hsnController.updateHsnById);

// Route to delete an HSN by ID
router.delete("/:id", hsnController.deleteHsnById);

module.exports = router;
