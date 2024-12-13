const BankAccount = require("../../../models/configurations/BankAccount/bankAccountModel");

// Add a new bank account
exports.addBankAccount = async (req, res) => {
  try {
    const { accountNo, accountName, bankName, branch, ifsc, openningBalance } =
      req.body;

    const newBankAccount = new BankAccount({
      accountNo,
      accountName,
      bankName,
      branch,
      ifsc,
      openningBalance,
    });

    await newBankAccount.save();

    res.status(201).json({
      message: "Bank account added successfully",
      data: newBankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding bank account", error });
  }
};

// Get all bank accounts
exports.getAllBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find();
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bank accounts", error });
  }
};

// Get a bank account by ID
exports.getBankAccountById = async (req, res) => {
  try {
    const bankAccount = await BankAccount.findById(req.params.id);
    if (!bankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }
    res.status(200).json(bankAccount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bank account", error });
  }
};

// Update a bank account by ID
exports.updateBankAccountById = async (req, res) => {
  try {
    const { accountNo, accountName, bankName, branch, ifsc, openningBalance } =
      req.body;

    const updatedBankAccount = await BankAccount.findByIdAndUpdate(
      req.params.id,
      { accountNo, accountName, bankName, branch, ifsc, openningBalance },
      { new: true }
    );

    if (!updatedBankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }
    res.status(200).json({
      message: "Bank account updated successfully",
      data: updatedBankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating bank account", error });
  }
};

// Delete a bank account by ID
exports.deleteBankAccountById = async (req, res) => {
  try {
    const deletedBankAccount = await BankAccount.findByIdAndDelete(
      req.params.id
    );
    if (!deletedBankAccount) {
      return res.status(404).json({ message: "Bank account not found" });
    }
    res.status(200).json({ message: "Bank account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bank account", error });
  }
};
