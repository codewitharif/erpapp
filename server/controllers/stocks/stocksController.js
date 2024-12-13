const Stocks = require("../../models/stocks/stocksModel");

// Add a new stock

exports.addStock = async (req, res) => {
  try {
    const {
      itemcode,
      companyId,
      item,
      itemDescription,
      hsn,
      gstinpercent,
      qty,
      mrpinrs,
      cpinrs,
    } = req.body;

    // Check if a stock entry with the same itemcode and companyId already exists
    const existingStock = await Stocks.findOne({ itemcode, companyId, item });

    if (existingStock) {
      // If it exists, update gstinpercent, mrpinrs, cpinrs, and increment the qty
      existingStock.qty += qty; // Increment the quantity by the provided qty value
      existingStock.gstinpercent = gstinpercent;
      existingStock.mrpinrs = mrpinrs;
      existingStock.cpinrs = cpinrs;
      await existingStock.save();

      res.status(200).json({
        message: "Stock updated successfully",
        data: existingStock,
      });
    } else {
      // If it doesn't exist, create a new stock entry
      const newStock = new Stocks({
        itemcode,
        companyId,
        item,
        itemDescription,
        hsn,
        gstinpercent,
        qty,
        mrpinrs,
        cpinrs,
      });

      await newStock.save();

      res
        .status(201)
        .json({ message: "New stock added successfully", data: newStock });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding or updating stock", error });
  }
};

// Get all available stocks
exports.getAvailableStocks = async (req, res) => {
  try {
    // Fetch stocks where quantity is greater than zero
    const availableStocks = await Stocks.find({ qty: { $gt: 0 } });
    res.status(200).json(availableStocks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available stocks", error });
  }
};

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stocks.find(); // Populate company details
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stocks", error });
  }
};

// Get a single stock by ID
exports.getStockById = async (req, res) => {
  const id = req.params.id;

  try {
    const stock = await Stocks.findById(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error });
  }
};

// Update a stock by ID
exports.updateStockById = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const updatedStock = await Stocks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res
      .status(200)
      .json({ message: "Stock updated successfully", data: updatedStock });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
};

// Delete a stock by ID
exports.deleteStockById = async (req, res) => {
  try {
    const deletedStock = await Stocks.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock", error });
  }
};

// Search for stocks with optional filters (company, item, date range)
exports.searchStocks = async (req, res) => {
  try {
    const { companyId, item, fromDate, toDate } = req.query;

    // Initialize an empty filter object
    let filters = {};

    // Add filters based on query parameters
    if (companyId) {
      filters.companyId = companyId;
    }

    if (item) {
      filters.item = item;
    }

    // Filter by date range if fromDate and toDate are provided
    if (fromDate && toDate) {
      filters.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else if (fromDate) {
      filters.createdAt = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filters.createdAt = { $lte: new Date(toDate) };
    }

    // Find stocks based on filters
    const stocks = await Stocks.find(filters);

    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Error searching stocks", error });
  }
};
