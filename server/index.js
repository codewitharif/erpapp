const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

//customer routes
const customerRoutes = require("./routes/customers/customerRoutes");
//configuration routes
const companyNameRoute = require("./routes/configurations/Company/companyNameRoute");
const beatNameRoute = require("./routes/configurations/Company/beatNameRoute");
const hsnRoute = require("./routes/configurations/Company/hsnRoute");
const termsAndCondition = require("./routes/configurations/TermsAndConditions/termsAndCondition");
const bankAccountRoutes = require("./routes/configurations/BankAccount/bankAccountRoutes");
const transportRoutes = require("./routes/configurations/Transport/transportRoutes");

//stocks routes
const stocksRoutes = require("./routes/stocks/stocksRoutes");

//sales routes
const salesRoutes = require("./routes/sales/salesRoutes");
//purchase Routes
const purchaseRoutes = require("./routes/purchases/purchaseRoutes");
//supplier Routes
const supplierRoutes = require("./routes/purchases/supplierRoutes");

// Middleware
app.use(
  cors({
    origin: [
      "https://movieappx.vercel.app"
    ],
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  })
);

app.use(express.json());


// Import Routes
app.use("/api/customers", customerRoutes);

//configuration routes
app.use("/api/companies", companyNameRoute);
app.use("/api/beats", beatNameRoute);
app.use("/api/hsn", hsnRoute);
app.use("/api/terms", termsAndCondition);
app.use("/api/bankAccounts", bankAccountRoutes);
app.use("/api/transports", transportRoutes);

//stocks routes
app.use("/api/stocks", stocksRoutes);

//sales routes
app.use("/api/sales", salesRoutes);

//purchase routes
app.use("/api/purchases", purchaseRoutes);
//supplier routes
app.use("/api/suppliers", supplierRoutes);

// Routes
app.get("/", (req, res) => {
  res.status(200).json("server is running fine...");
});

// Import Routes (for example)
//const yourRoutes = require("./server/routes/yourRoutes");
//app.use("/api", yourRoutes);

// DB Connection
const connectDB = require("./db/db");
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
