const express = require("express");
const router = express.Router();
const transportController = require("../../../controllers/configurations/Transport/transportController");

//route  to get all the transports
router.get(
  "/getAllTransportsWithPagination",
  transportController.getAllTransportsWithPagi
);

// Route to add a new transport entry
router.post("/", transportController.addTransport);

// Route to get all transport entries
router.get("/", transportController.getAllTransports);

// Route to get a transport entry by ID
router.get("/:id", transportController.getTransportById);

// Route to update a transport entry by ID
router.put("/:id", transportController.updateTransportById);

// Route to delete a transport entry by ID
router.delete("/:id", transportController.deleteTransportById);

module.exports = router;
