const Customer = require("../../models/customers/customerModel");
const nodemailer = require("nodemailer");
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

// Send email to customer

exports.sendMessage = async (req, res) => {
  const { subject, message, recipients, sendToAll } = req.body;

  try {
    let targetCustomers = [];

    if (sendToAll) {
      targetCustomers = await Customer.find({});
    } else if (recipients && recipients.length > 0) {
      targetCustomers = await Customer.find({ _id: { $in: recipients } });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const sendPromises = targetCustomers.map((customer) => {
      if (!customer.email) return null;
      return transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: customer.email,
        subject,
        text: message,
      });
    });

    await Promise.all(sendPromises);

    res
      .status(200)
      .json({ success: true, message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
