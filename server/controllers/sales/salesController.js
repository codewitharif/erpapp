const Sales = require("../../models/sales/salesModel");
const SoldItem = require("../../models/sales/soldItemModel");
const Customer = require("../../models/customers/customerModel");
const Stock = require("../../models/stocks/stocksModel");

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const {
      items,
      customerId,
      invoiceNo,
      totalAmount,
      discount,
      transportCharges,
      gstTotal,
      netTotal,
      paymentMethod,
      bankId,
      balance,
      purchaseOrderNo,
      remark,
    } = req.body;

    // 1. Create Sold Items
    const soldItems = new SoldItem({
      items, // This is the array of items passed in the request body
    });

    const savedSoldItems = await soldItems.save();

    // 2. Update stock quantities based on sold items
    for (let item of items) {
      const {
        companyId,
        itemCode,
        itemName,
        hsn,
        mrp,
        discountPercent,
        discountValue,
        rate,
        gstPercent,
        gstValue,
        qty,
        total,
        uom,
      } = item;

      // Find the stock by item code and itemName for the specific company
      let stock = await Stock.findOne({
        companyId,
        itemcode: itemCode,
        item: itemName,
      });

      if (stock) {
        // Deduct the sold quantity from stock, allowing stock to go negative
        stock.qty -= qty;
      } else {
        // If no stock entry exists, return an error message
        return res.status(404).json({
          message: `Stock not found for item: ${itemName} in company: ${companyId}`,
        });
      }

      // Save the stock update
      await stock.save();
    }

    // 3. Create the sale with the reference to the soldItemsId
    const newSale = new Sales({
      customerId,
      invoiceNo,
      soldItemsId: savedSoldItems._id, // Store the reference to sold items
      totalAmount,
      discount,
      transportCharges,
      gstTotal,
      netTotal,
      paymentMethod,
      bankId,
      balance,
      purchaseOrderNo,
      remark,
    });

    const savedSale = await newSale.save();

    res
      .status(201)
      .json({ message: "Sale created successfully", sale: savedSale });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Error creating sale", error });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    // Find all sales and populate the reference to sold items
    const sales = await Sales.find().populate("soldItemsId");

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales", error });
  }
};

// Get sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;

    // Find sale by ID and populate the soldItems field using soldItemsId reference
    const sale = await Sales.findById(saleId).populate("soldItemsId");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sale", error });
  }
};

// Update sale by ID
// Update sale by ID
exports.updateSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const {
      soldItemsId,
      items,
      customerId,
      invoiceNo,
      totalAmount,
      discount,
      transportCharges,
      gstTotal,
      netTotal,
      paymentMethod,
      bankId,
      balance,
      purchaseOrderNo,
      remark,
    } = req.body;

    // 1. Find the current sale document
    const currentSale = await Sales.findById(saleId).populate("soldItemsId");
    if (!currentSale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    console.log("step 1 current sale founded");
    // 2. Update stock for each item in the current sale (reverse the original stock change)
    for (const currentItem of currentSale.soldItemsId.items) {
      const stock = await Stock.findOne({
        companyId: currentItem.companyId,
        itemCode: currentItem.itemCode,
        itemName: currentItem.itemName,
      });

      if (stock) {
        stock.qty += currentItem.qty; // Restore the original stock
        await stock.save();
      }
    }

    console.log("step 2 loop is passed");

    // 3. Find the sold item document (related to the updated sale)
    const soldItemDoc = await SoldItem.findById(soldItemsId);
    if (!soldItemDoc) {
      return res.status(404).json({ message: "Sold item document not found" });
    }
    console.log("step 3 soldItemDoc line is successfully passed");

    // 4. Update the items within the sold items document
    items.forEach((item) => {
      const index = soldItemDoc.items.findIndex(
        (i) => i._id.toString() === item._id
      );
      if (index !== -1) {
        soldItemDoc.items[index] = item;
      } else {
        console.error(`Item with ID ${item._id} not found in sold items.`);
      }
    });

    await soldItemDoc.save();
    console.log("step 4 is succesfully passed");

    // 5. Update stock based on new quantities
    console.log("my items are ", items);
    for (const item of items) {
      console.log("companyId:", item.companyId);
      console.log("itemCode:", item.itemCode);
      console.log("itemName:", item.itemName);
      const stock = await Stock.findOne({
        companyId: item.companyId,
        itemCode: item.itemCode,
        itemName: item.itemName,
      });
      console.log("my stock is ", stock);
      if (stock) {
        stock.qty -= item.qty; // Deduct the updated quantity from stock
        await stock.save();
      }
    }
    console.log("step 5 is succesfully passed");

    // 6. Update the sale data
    const updatedSale = await Sales.findByIdAndUpdate(
      saleId,
      {
        customerId,
        invoiceNo,
        soldItemsId: soldItemDoc._id, // Reference to the updated sold items
        totalAmount,
        discount,
        transportCharges,
        gstTotal,
        netTotal,
        paymentMethod,
        bankId,
        balance,
        purchaseOrderNo,
        remark,
      },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res
      .status(200)
      .json({ message: "Sale updated successfully", sale: updatedSale });
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error });
  }
};

// Delete sale by ID
exports.deleteSale = async (req, res) => {
  try {
    const saleId = req.params.id;

    // 1. Find the sale by ID
    const sale = await Sales.findById(saleId);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // 2. Delete the associated sold items
    await SoldItem.findByIdAndDelete(sale.soldItemsId);

    // 3. Delete the sale itself
    await Sales.findByIdAndDelete(saleId);

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error });
  }
};

// Filter sales by customer ID, date range, or both
exports.filterSales = async (req, res) => {
  try {
    const { customerId, fromDate, toDate } = req.query;

    // Build query conditions
    let query = {};

    // Filter by customer ID
    if (customerId) {
      query.customerId = customerId; // Assuming customerId is a valid MongoDB ObjectId
    }

    // Filter by date range
    if (fromDate && toDate) {
      query.saleDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Find sales that match the query
    const sales = await Sales.find(query);
    console.log(sales);

    if (sales.length === 0) {
      return res
        .status(404)
        .json({ message: "No sales found for the given criteria" });
    }

    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sales data", error });
  }
};
