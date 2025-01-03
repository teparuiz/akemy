const controller = require("../controllers/invoice");
const router = require("express").Router();
const authenticateApiKey = require("../middleware/auth");

router.get("/invoice", authenticateApiKey, controller.getInvoice);
router.get("/invoice/:id", authenticateApiKey, controller.getInvoiceById);
router.post("/create-invoice", authenticateApiKey, controller.createInvoice);
router.put("/update-invoice/:id", authenticateApiKey, controller.updateInvoice);
router.delete(
  "/delete-invoice/:id",
  authenticateApiKey,
  controller.deleteInvoice
);

module.exports = router;
