const express = require("express");
const router = express.Router();
const bankAccountController = require("../../../controllers/configurations/BankAccount/bankAccountController");

// Route to add a new bank account
router.post("/", bankAccountController.addBankAccount);

// Route to get all bank accounts
router.get("/", bankAccountController.getAllBankAccounts);

// Route to get a bank account by ID
router.get("/:id", bankAccountController.getBankAccountById);

// Route to update a bank account by ID
router.put("/:id", bankAccountController.updateBankAccountById);

// Route to delete a bank account by ID
router.delete("/:id", bankAccountController.deleteBankAccountById);

module.exports = router;
