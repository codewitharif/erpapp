const express = require("express");
const router = express.Router();
const beatNameController = require("../../../controllers/configurations/Company/beatNameController");

// Route to add a new company
router.post("/", beatNameController.addBeatName);

// Route to get all companies
router.get("/", beatNameController.getAllBeats);

// Route to get a company by ID
router.get("/:id", beatNameController.getBeatById);

// Route to update a company by ID
router.put("/:id", beatNameController.updateBeatById);

// Route to delete a company by ID
router.delete("/:id", beatNameController.deleteBeatById);

module.exports = router;
