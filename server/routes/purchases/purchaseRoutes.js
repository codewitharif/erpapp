const express = require("express");
const router = express.Router();
const purchaseController = require("../../controllers/purchases/purchaseController");

// POST /api/purchases - Create a new purchase
router.post("/", purchaseController.createPurchase);

// GET /api/purchases - Get all purchases
router.get("/", purchaseController.getAllPurchases);

// GET /api/purchases/filter - Filter purchases based on item, supplier, and date range
router.get("/filter", purchaseController.filterPurchases);

// GET /api/purchases/:id - Get a specific purchase by ID (with items)
router.get("/:id", purchaseController.getPurchaseById);

// PUT /api/purchases/:id - Update a specific purchase by ID
router.put("/:id", purchaseController.updatePurchase);

// DELETE /api/purchases/:id - Delete a specific purchase by ID
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;
