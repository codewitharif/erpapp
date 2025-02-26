const Sales = require("../../models/sales/salesModel");
const SoldItem = require("../../models/sales/soldItemModel");
const Customer = require("../../models/customers/customerModel");
const Stock = require("../../models/stocks/stocksModel");
const mongoose = require("mongoose");

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const {
      customerId,
      invoiceNo,
      totalAmount,
      discount,
      transportCharges,
      gstTotal,
      netTotal,
      balance,
      cash,
      card,
      bankId,
      transportId,
      remark,
      items,
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
        rate,
        discountPercent,
        discountAmount,
        netRate,
        quantity,
        gstPercent,
        gstAmount,
        totalAmount,
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
        stock.qty -= quantity;
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
      balance,
      cash,
      card,
      bankId,
      transportId,
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

    res.status(200).json({ sales });
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
      customerId,
      invoiceNo,
      totalAmount,
      discount,
      transportCharges,
      gstTotal,
      netTotal,
      balance,
      cash,
      card,
      bankId,
      transportId,
      remark,
      items,
    } = req.body;

    // 1. Find the existing sale
    const sale = await Sales.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // 2. Validate invoiceNo uniqueness if changed
    if (invoiceNo && invoiceNo !== sale.invoiceNo) {
      const existingSale = await Sales.findOne({ invoiceNo });
      if (existingSale) {
        return res
          .status(400)
          .json({ message: "Invoice number must be unique" });
      }
    }

    // 3. Revert stock quantities from OLD sold items
    const oldSoldItems = await SoldItem.findById(sale.soldItemsId);
    if (!oldSoldItems) {
      return res
        .status(404)
        .json({ message: "Associated sold items not found" });
    }

    for (const oldItem of oldSoldItems.items) {
      const stock = await Stock.findOne({
        companyId: oldItem.companyId,
        itemcode: oldItem.itemCode,
        item: oldItem.itemName,
      });

      if (stock) {
        stock.qty += oldItem.quantity; // Add back original quantity
        await stock.save();
      }
    }

    // 4. Update sold items with NEW data
    if (items) {
      // Delete old sold items
      await SoldItem.findByIdAndDelete(sale.soldItemsId);

      // Create new sold items
      const newSoldItems = new SoldItem({ items });
      await newSoldItems.save();
      sale.soldItemsId = newSoldItems._id;

      // Deduct NEW quantities from stock
      for (const newItem of items) {
        const stock = await Stock.findOne({
          companyId: newItem.companyId,
          itemcode: newItem.itemCode,
          item: newItem.itemName,
        });

        if (stock) {
          stock.qty -= newItem.quantity;
          await stock.save();
        } else {
          return res.status(404).json({
            message: `Stock not found for item: ${newItem.itemName} in company: ${newItem.companyId}`,
          });
        }
      }
    }

    // 5. Update sale document
    const updatedSale = await Sales.findByIdAndUpdate(
      saleId,
      {
        customerId,
        invoiceNo,
        totalAmount,
        discount,
        transportCharges,
        gstTotal,
        netTotal,
        balance,
        cash,
        card,
        bankId,
        transportId,
        remark,
        soldItemsId: sale.soldItemsId,
      },
      { new: true }
    ).populate("soldItemsId");

    res
      .status(200)
      .json({ message: "Sale updated successfully", sale: updatedSale });
  } catch (error) {
    console.error("Error updating sale:", error);
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

const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { firstDay, lastDay };
};

exports.getSalesSummary = async (req, res) => {
  try {
    let { from, to } = req.query;

    // Use current month's range if no filters are provided
    if (!from || !to) {
      const { firstDay, lastDay } = getCurrentMonthRange();
      from = new Date(firstDay);
      to = new Date(lastDay);
    } else {
      from = new Date(from);
      to = new Date(to);
    }

    console.log("Filtering sales from:", from, "to:", to);

    const result = await Sales.aggregate([
      {
        $match: {
          saleDate: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: null,
          totalNetRate: { $sum: "$netTotal" },
          totalGst: { $sum: "$gstTotal" },
          saleAmount: { $sum: "$totalAmount" },
          transportCharges: { $sum: "$transportCharges" },
          cashReceived: { $sum: "$cash" },
          cardReceived: { $sum: "$card" },
        },
      },
    ]);

    const summary =
      result.length > 0
        ? result[0]
        : {
            totalNetRate: 0,
            totalGst: 0,
            saleAmount: 0,
            transportCharges: 0,
            cashReceived: 0,
            cardReceived: 0,
          };

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in fetching sales summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSalesSummaryForHomeSection = async (req, res) => {
  try {
    // Get the start and end of the current day
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    console.log(
      "Fetching today's sales summary from:",
      startOfDay,
      "to:",
      endOfDay
    );

    const result = await Sales.aggregate([
      {
        $match: {
          saleDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalNetRate: { $sum: "$netTotal" },
          totalGst: { $sum: "$gstTotal" },
          saleAmount: { $sum: "$totalAmount" },
          transportCharges: { $sum: "$transportCharges" },
          cashReceived: { $sum: "$cash" },
          cardReceived: { $sum: "$card" },
        },
      },
    ]);

    const summary =
      result.length > 0
        ? result[0]
        : {
            totalNetRate: 0,
            totalGst: 0,
            saleAmount: 0,
            transportCharges: 0,
            cashReceived: 0,
            cardReceived: 0,
          };

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in fetching sales summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Calculate total net rate
// exports.totalSale = async (req, res) => {
//   try {
//     let { from, to } = req.query;

//     // If no filter is applied, use the current month
//     if (!from || !to) {
//       const { firstDay, lastDay } = getCurrentMonthRange();
//       from = firstDay;
//       to = lastDay;
//     } else {
//       from = new Date(from);
//       to = new Date(to);
//     }

//     const result = await Sales.aggregate([
//       { $match: { date: { $gte: from, $lte: to } } },
//       {
//         $group: {
//           _id: null,
//           totalNetRate: { $sum: "$netTotal" },
//         },
//       },
//     ]);

//     const totalNetRate = result[0]?.totalNetRate || 0; // Default to 0 if no results
//     res.status(200).json({ totalNetRate });
//   } catch (error) {
//     console.error("Error in calculating total net rate:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// exports.totalGst = async (req, res) => {
//   try {
//     const result = await Sales.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalGst: { $sum: "$gstTotal" },
//         },
//       },
//     ]);

//     const totalGst = result[0]?.totalGst || 0; // Default to 0 if no results
//     res.status(200).json({ totalGst });
//   } catch (error) {
//     console.error("Error in calculating total gst:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// exports.saleAmount = async (req, res) => {
//   try {
//     const result = await Sales.aggregate([
//       {
//         $group: {
//           _id: null,
//           saleAmount: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     const saleAmount = result[0]?.saleAmount || 0; // Default to 0 if no results
//     res.status(200).json({ saleAmount });
//   } catch (error) {
//     console.error("Error in calculating sale Amount:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// exports.transportCharges = async (req, res) => {
//   try {
//     const result = await Sales.aggregate([
//       {
//         $group: {
//           _id: null,
//           transportCharges: { $sum: "$transportCharges" },
//         },
//       },
//     ]);

//     const transportCharges = result[0]?.transportCharges || 0; // Default to 0 if no results
//     res.status(200).json({ transportCharges });
//   } catch (error) {
//     console.error("Error in calculating transport Charges:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// exports.cashReceived = async (req, res) => {
//   try {
//     const result = await Sales.aggregate([
//       {
//         $group: {
//           _id: null,
//           cashReceived: { $sum: "$cash" },
//         },
//       },
//     ]);

//     const cashReceived = result[0]?.cashReceived || 0; // Default to 0 if no results
//     res.status(200).json({ cashReceived });
//   } catch (error) {
//     console.error("Error in calculating cash Received:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// exports.cardReceived = async (req, res) => {
//   try {
//     const result = await Sales.aggregate([
//       {
//         $group: {
//           _id: null,
//           cardReceived: { $sum: "$card" },
//         },
//       },
//     ]);

//     const cardReceived = result[0]?.cardReceived || 0; // Default to 0 if no results
//     res.status(200).json({ cardReceived });
//   } catch (error) {
//     console.error("Error in calculating card Received:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
