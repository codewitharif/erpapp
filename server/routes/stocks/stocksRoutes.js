const express = require("express");
const router = express.Router();
const stocksController = require("../../controllers/stocks/stocksController");

// Route to search stocks by company, item, and date range
router.get("/search", stocksController.searchStocks);

// Route to add a new stock
router.post("/", stocksController.addStock);

// Route to get all available stocks
router.get("/available", stocksController.getAvailableStocks);

// Route to get all stocks
router.get("/", stocksController.getAllStocks);

// Route to get a single stock by ID
router.get("/:id", stocksController.getStockById);

// Route to update a stock by ID
router.put("/:id", stocksController.updateStockById);

// Route to delete a stock by ID
router.delete("/:id", stocksController.deleteStockById);

module.exports = router;
