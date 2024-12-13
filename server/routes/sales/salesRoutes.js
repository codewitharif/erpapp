const express = require("express");
const router = express.Router();
const salesController = require("../../controllers/sales/salesController");

router.get("/filter", salesController.filterSales); // Change from "/sales/filter" to "/filter"

// Create a new sale
router.post("/", salesController.createSale);

// Get all sales
router.get("/", salesController.getAllSales);

// Get a single sale by ID
router.get("/:id", salesController.getSaleById);

// Update a sale by ID
router.put("/:id", salesController.updateSale);

// Delete a sale by ID
router.delete("/:id", salesController.deleteSale);

module.exports = router;
