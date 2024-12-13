const Purchase = require("../../models/purchases/purchaseModel");
const PurchaseItems = require("../../models/purchases/purchaseItemsModel");
const Stock = require("../../models/stocks/stocksModel");

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const {
      supplierId,
      purchaseDate,
      billNo,
      totalAmount,
      gstTotal,
      otherCharges,
      discount,
      netTotal,
      balance,
      cash,
      card,
      cheque,
      chequeNo,
      bankId,
      transportId,
      remark,
      items, // Items array from the purchase
    } = req.body;

    // 1. Create purchase items
    const purchaseItems = new PurchaseItems({
      items,
    });

    const savedPurchaseItems = await purchaseItems.save();

    // 2. Create the purchase
    const newPurchase = new Purchase({
      supplierId,
      purchaseDate,
      billNo,
      totalAmount,
      gstTotal,
      otherCharges,
      discount,
      netTotal,
      balance,
      cash,
      card,
      cheque,
      chequeNo,
      bankId,
      transportId,
      remark,
      purchaseItemsId: savedPurchaseItems._id,
    });

    const savedPurchase = await newPurchase.save();

    // 3. Update stock quantities based on purchased items
    for (let item of items) {
      const {
        companyId,
        itemCode,
        itemName, // This maps to `item` field in the stock schema
        hsn,
        rate,
        discountPercent,
        discountAmount,
        netRate,
        gstPercent,
        gstAmount,
        quantity,
        totalAmount,
        mrp,
      } = item;

      // Find the stock by item code and itemName
      let stock = await Stock.findOne({
        companyId,
        itemcode: itemCode,
        item: itemName,
      });

      if (stock) {
        // If stock exists, increase the quantity
        stock.qty += Number(quantity);
        stock.mrpinrs = mrp;
        stock.cpinrs = netRate;
      } else {
        // If stock doesn't exist, create a new stock entry
        stock = new Stock({
          itemcode: itemCode,
          companyId,
          item: itemName, // Use itemName as item
          itemDescription: item.itemDescription || "No description", // Provide a default if itemDescription is missing
          hsn: hsn,
          gstinpercent: gstPercent,
          qty: quantity,
          mrpinrs: mrp,
          cpinrs: netRate,
        });
      }

      // Save the stock update or creation
      await stock.save();
    }

    res.status(201).json({
      message: "Purchase created successfully, stock updated",
      purchase: savedPurchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating purchase", error });
  }
};

// Get all purchases (with populated purchase items)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("purchaseItemsId");
    res.status(200).json({ purchases });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchases", error });
  }
};

// Get a single purchase by ID (with items)
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate(
      "purchaseItemsId"
    );
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.status(200).json({ purchase });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchase", error });
  }
};

// Update a purchase by ID (with items)
//ye actual implemented update api h
// exports.updatePurchase = async (req, res) => {
//   try {
//     const purchaseId = req.params.id;
//     const {
//       supplierId,
//       purchaseDate,
//       billNo,
//       totalAmount,
//       gstTotal,
//       otherCharges,
//       discount,
//       netTotal,
//       balance,
//       cash,
//       card,
//       cheque,
//       chequeNo,
//       bankId,
//       transportId,
//       remark,
//       purchaseItemsId,
//       items,
//     } = req.body;

//     // Find the purchase item document by purchaseItemsId
//     const purchaseItemDoc = await PurchaseItems.findById(purchaseItemsId);
//     if (!purchaseItemDoc) {
//       return res
//         .status(404)
//         .json({ message: "Purchase item document not found" });
//     }

//     // Store the old quantities of each item
//     const originalItems = purchaseItemDoc.items.map((item) => ({
//       _id: item._id,
//       quantity: item.quantity,
//     }));

//     // Update nested items in the purchase items document
//     items.forEach((item) => {
//       const index = purchaseItemDoc.items.findIndex(
//         (i) => i._id.toString() === item._id
//       );
//       if (index !== -1) {
//         purchaseItemDoc.items[index] = item; // Update the existing item
//       } else {
//         console.error(`Item with ID ${item._id} not found in purchase items.`);
//       }
//     });

//     // Save the updated purchase items document
//     await purchaseItemDoc.save();

//     // Update stock quantities based on updated items
//     for (let item of items) {
//       const {
//         companyId,
//         itemCode,
//         itemName,
//         hsn,
//         rate,
//         discountPercent,
//         discountAmount,
//         netRate,
//         gstPercent,
//         gstAmount,
//         quantity,
//         totalAmount,
//         mrp,
//       } = item;

//       // Find the original quantity for this item before update
//       const originalItem = originalItems.find(
//         (i) => i._id.toString() === item._id.toString()
//       );
//       const originalQuantity = originalItem ? originalItem.quantity : 0;

//       // Find the stock by item code and itemName
//       let stock = await Stock.findOne({
//         companyId,
//         itemcode: itemCode,
//         item: itemName,
//       });

//       if (stock) {
//         // Calculate the quantity difference and adjust stock
//         const quantityDifference = quantity - originalQuantity;
//         stock.qty += quantityDifference; // Adjust stock quantity by the difference

//         // Update MRP and netRate
//         stock.mrpinrs = mrp; // Update MRP
//         stock.cpinrs = netRate; // Update cost price (net rate)
//       } else {
//         // If stock doesn't exist, create a new stock entry
//         stock = new Stock({
//           itemcode: itemCode,
//           companyId,
//           item: itemName,
//           itemDescription: item.itemDescription || "No description",
//           hsn: hsn,
//           gstinpercent: gstPercent,
//           qty: quantity, // Use the new quantity
//           mrpinrs: mrp,
//           cpinrs: netRate,
//         });
//       }

//       // Save the stock update or creation
//       await stock.save();
//     }

//     // Update the purchase with the new items and other details

//     const updatedPurchase = await Purchase.findByIdAndUpdate(
//       purchaseId,
//       {
//         supplierId,
//         purchaseDate,
//         billNo,
//         totalAmount,
//         gstTotal,
//         otherCharges,
//         discount,
//         netTotal,
//         balance,
//         cash,
//         card,
//         cheque,
//         chequeNo,
//         bankId,
//         transportId,
//         remark,
//         purchaseItemsId,
//       },
//       { new: true }
//     );

//     if (!updatedPurchase) {
//       return res.status(404).json({ message: "Purchase not found" });
//     }

//     // Return success response
//     return res.status(200).json({
//       message: "Purchase updated successfully, stock updated",
//       purchase: updatedPurchase,
//     });
//   } catch (error) {
//     console.error("Error updating purchase:", error);
//     res.status(500).json({ message: "Error updating purchase", error });
//   }
// };

//ye newly update fail ho gya api h
// exports.updatePurchase = async (req, res) => {
//   const purchaseId = req.params.id;

//   const {
//     supplierId,
//     purchaseDate,
//     billNo,
//     totalAmount,
//     gstTotal,
//     otherCharges,
//     discount,
//     netTotal,
//     balance,
//     cash,
//     card,
//     cheque,
//     chequeNo,
//     bankId,
//     transportId,
//     remark,
//     purchaseItemsId,
//     items,
//   } = req.body;

//   try {
//     // Update purchase details
//     const updatedPurchase = await Purchase.findByIdAndUpdate(
//       purchaseItemsId,
//       {
//         supplierId,
//         purchaseDate,
//         billNo,
//         totalAmount,
//         gstTotal,
//         otherCharges,
//         discount,
//         netTotal,
//         balance,
//         cash,
//         card,
//         cheque,
//         chequeNo,
//         bankId,
//         transportId,
//         remark,
//       },
//       { new: true } // returns the updated document
//     );

//     if (!updatedPurchase) {
//       return res.status(404).json({ message: "Purchase not found" });
//     }

//     // Process each item in the items array
//     for (const item of items) {
//       if (item._id) {
//         // Update existing item
//         await PurchaseItem.findByIdAndUpdate(item._id, item);
//       } else {
//         // Add new item
//         const newItem = new PurchaseItem({
//           ...item,
//           purchaseId: purchaseItemsId,
//         });
//         await newItem.save();

//         // Optionally add new item reference to the purchase document if needed
//         updatedPurchase.items.push(newItem._id);
//       }
//     }

//     // Save the updated purchase with new item references (if any)
//     await updatedPurchase.save();

//     res
//       .status(200)
//       .json({ message: "Purchase updated successfully", updatedPurchase });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "An error occurred while updating the purchase",
//       error,
//     });
//   }
// };

//ye 3rd attempt wala h update ap h
// Update a purchase by ID (with items)
exports.updatePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    console.log("my purchase id is ", purchaseId);
    const {
      supplierId,
      purchaseDate,
      billNo,
      totalAmount,
      gstTotal,
      otherCharges,
      discount,
      netTotal,
      balance,
      cash,
      card,
      cheque,
      chequeNo,
      bankId,
      transportId,
      remark,
      purchaseItemsId,
      items,
    } = req.body;
    console.log("my purchase items id is ", purchaseItemsId);

    // Fetch the existing purchase items document
    const purchaseItemDoc = await PurchaseItems.findById(purchaseItemsId);
    console.log("my purchase item doument is ", purchaseItemDoc);
    if (!purchaseItemDoc) {
      return res
        .status(404)
        .json({ message: "Purchase item document not found" });
    }

    // Store the original quantities of each item for stock adjustment
    const originalItems = purchaseItemDoc.items.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
    }));

    // Update or add items in the purchase items document
    items.forEach((item) => {
      const index = purchaseItemDoc.items.findIndex(
        (i) => i._id && i._id.toString() === item._id
      );
      if (index !== -1) {
        // Update existing item
        purchaseItemDoc.items[index] = {
          ...purchaseItemDoc.items[index],
          ...item,
        };
      } else {
        // New item, add to the purchase items document
        purchaseItemDoc.items.push(item);
      }
    });

    // Save the updated purchase items document
    await purchaseItemDoc.save();

    // Update stock quantities based on updated items
    for (let item of items) {
      const {
        _id,
        companyId,
        itemCode,
        itemName,
        hsn,
        rate,
        discountPercent,
        discountAmount,
        netRate,
        gstPercent,
        gstAmount,
        quantity,
        totalAmount,
        mrp,
      } = item;

      // Find the original quantity for this item before update
      const originalItem = originalItems.find(
        (i) => i._id && i._id.toString() === item._id
      );
      const originalQuantity = originalItem ? originalItem.quantity : 0;

      // Calculate quantity difference for stock adjustment
      const quantityDifference = quantity - originalQuantity;

      // Find or create stock entry
      let stock = await Stock.findOne({
        companyId,
        itemcode: itemCode,
        item: itemName,
      });
      if (stock) {
        // Adjust stock quantity
        stock.qty += quantityDifference;

        // Update MRP and netRate if they have changed
        stock.mrpinrs = mrp;
        stock.cpinrs = netRate;
      } else {
        // New stock entry
        stock = new Stock({
          itemcode: itemCode,
          companyId,
          item: itemName,
          itemDescription: item.itemDescription || "No description",
          hsn: hsn,
          gstinpercent: gstPercent,
          qty: quantity,
          mrpinrs: mrp,
          cpinrs: netRate,
        });
      }

      // Save stock changes
      await stock.save();
    }

    // Update purchase document with new details
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      purchaseId,
      {
        supplierId,
        purchaseDate,
        billNo,
        totalAmount,
        gstTotal,
        otherCharges,
        discount,
        netTotal,
        balance,
        cash,
        card,
        cheque,
        chequeNo,
        bankId,
        transportId,
        remark,
        purchaseItemsId,
      },
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Return success response
    return res.status(200).json({
      status: 200,
      message: "Purchase updated successfully, stock updated",
      purchase: updatedPurchase,
    });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ message: "Error updating purchase", error });
  }
};

// Delete a purchase by ID
exports.deletePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    // 1. Find the sale by ID
    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // 2. Delete the associated sold items
    await PurchaseItems.findByIdAndDelete(purchase.purchaseItemsId);

    // 3. Delete the sale itself
    await Purchase.findByIdAndDelete(purchaseId);

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error });
  }
};

exports.filterPurchases = async (req, res) => {
  try {
    const { item, supplierId, from, to } = req.query; // Extracting query params

    // Create a filter object for the Purchase model
    let filter = {};

    // Add supplierId to the filter if provided
    if (supplierId) {
      filter.supplierId = supplierId; // Exact match for supplierId
    }

    // Add date range to the filter if both from and to are provided
    if (from && to) {
      filter.purchaseDate = { $gte: new Date(from), $lte: new Date(to) };
    } else if (from) {
      filter.purchaseDate = { $gte: new Date(from) };
    } else if (to) {
      filter.purchaseDate = { $lte: new Date(to) };
    }

    // Fetch purchases based on the constructed filter and populate purchaseItemsId
    let purchasesQuery = Purchase.find(filter).populate({
      path: "purchaseItemsId", // Populate purchaseItemsId field in Purchase model
      populate: {
        path: "items", // Nested populate for items array inside purchaseItemsId
      },
    });

    // Execute the query to get all matching purchases
    let purchases = await purchasesQuery;

    // If item filter is provided, process items but don't remove unmatched ones
    if (item) {
      purchases = purchases.map((purchase) => {
        if (
          purchase.purchaseItemsId &&
          purchase.purchaseItemsId.items.length > 0
        ) {
          // Mark the items that match the search criteria (case-insensitive)
          purchase.purchaseItemsId.items = purchase.purchaseItemsId.items.map(
            (purchaseItem) => {
              return {
                ...purchaseItem._doc, // Keep the original item fields
                matchesItemFilter: purchaseItem.itemName
                  .toLowerCase()
                  .includes(item.toLowerCase()), // Add a field to indicate if it matches
              };
            }
          );
        }
        return purchase;
      });
    }

    // Respond with the filtered purchases
    res.status(200).json({
      message: "Filtered purchases retrieved successfully",
      purchases: purchases,
    });
  } catch (error) {
    console.error("Error filtering purchases:", error);
    res.status(500).json({ message: "Error filtering purchases", error });
  }
};

//optimization code for  filterPurchases

// if (item) {
//   purchases = purchases.filter(purchase =>
//     purchase.purchaseItemsId.items.some(purchaseItem =>
//       purchaseItem.itemName.toLowerCase().includes(item.toLowerCase())
//     )
//   );
// }
