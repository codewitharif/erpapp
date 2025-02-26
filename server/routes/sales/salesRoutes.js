const express = require("express");
const router = express.Router();
const salesController = require("../../controllers/sales/salesController");

//total value of sale
// router.get("/total-net-rate", salesController.totalSale);
// router.get("/total-gst", salesController.totalGst);
// router.get("/sale-amount", salesController.saleAmount);
// router.get("/transport-charges", salesController.transportCharges);
// router.get("/card-recieved", salesController.cardReceived);
// router.get("/cash-recieved", salesController.cashReceived);
router.get("/summary", salesController.getSalesSummary);
router.get("/summary-for-home", salesController.getSalesSummaryForHomeSection);

//rote for filter
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
