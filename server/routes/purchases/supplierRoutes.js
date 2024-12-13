const express = require("express");
const router = express.Router();
const supplierController = require("../../controllers/purchases/supplierController");

// POST /api/suppliers - Create a new supplier
router.post("/", supplierController.createSupplier);

// GET /api/suppliers - Get all suppliers
router.get("/", supplierController.getAllSuppliers);

// GET /api/suppliers/:id - Get a specific supplier by ID
router.get("/:id", supplierController.getSupplierById);

// PUT /api/suppliers/:id - Update a specific supplier by ID
router.put("/:id", supplierController.updateSupplier);

// DELETE /api/suppliers/:id - Delete a specific supplier by ID
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
