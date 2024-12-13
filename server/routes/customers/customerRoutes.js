const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/customers/customerController");
// Route to create a customer
router.post("/", customerController.createCustomer);

// Route to get all customers
router.get("/", customerController.getAllCustomers);

// Route to search for customers by name, contact_no, or city
router.get("/search", customerController.searchCustomers);

// Route to get a customer by ID
router.get("/:id", customerController.getCustomerById);

// Route to update a customer by ID
router.put("/:id", customerController.updateCustomer);

// Route to delete a customer by ID
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
