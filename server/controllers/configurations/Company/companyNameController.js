const CompanyName = require("../../../models/configurations/Company/companyNameModel");

// Add a new company
exports.addCompanyName = async (req, res) => {
  try {
    const { companyName } = req.body;

    const newCompany = new CompanyName({ companyName });
    await newCompany.save();

    res
      .status(201)
      .json({ message: "Company name added successfully", data: newCompany });
  } catch (error) {
    res.status(500).json({ message: "Error adding company name", error });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await CompanyName.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

// GET /api/companies?page=1&limit=5
exports.getAllCompaniesWithpagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const companies = await CompanyName.find().skip(skip).limit(limit);
    const total = await CompanyName.countDocuments();

    res.status(200).json({
      data: companies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

// Get a company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await CompanyName.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company", error });
  }
};

// Update a company by ID
exports.updateCompanyById = async (req, res) => {
  try {
    const updatedCompany = await CompanyName.findByIdAndUpdate(
      req.params.id,
      { companyName: req.body.companyName },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    res
      .status(200)
      .json({ message: "Company updated successfully", data: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
};

// Delete a company by ID
exports.deleteCompanyById = async (req, res) => {
  try {
    const deletedCompany = await CompanyName.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};
