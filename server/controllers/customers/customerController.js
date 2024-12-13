const Customer = require("../../models/customers/customerModel");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



//get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const { name, mobile, city } = req.query;

    // Create a filter object based on query parameters
    const filter = {};
    if (name) filter.full_name = new RegExp(name, "i"); // case-insensitive search for name
    if (mobile) filter.contact_no = new RegExp(mobile, "i"); // case-insensitive search for contact_no
    if (city) filter.city = new RegExp(city, "i"); // case-insensitive search for city

    // Find customers based on the filter criteria
    const customers = await Customer.find(filter);
    res.status(200).json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a customer by ID
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a customer by ID
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Search customers by name, contact_no, or city
exports.searchCustomers = async (req, res) => {
  try {
    const { name, contact_no, city } = req.query;
    const filter = {};

    // Add conditions to the filter based on query parameters
    if (name) filter.full_name = { $regex: name, $options: "i" }; // Case-insensitive search
    if (contact_no) filter.contact_no = { $regex: contact_no, $options: "i" }; // Case-insensitive search
    if (city) filter.city = { $regex: city, $options: "i" }; // Case-insensitive search

    const customers = await Customer.find(filter);
    res.status(200).json(customers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
