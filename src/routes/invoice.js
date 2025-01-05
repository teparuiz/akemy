const controller = require("../controllers/invoice");
const router = require("express").Router();
const authenticateApiKey = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const invoiceSchema = require("../schemas/invoice");

router.get("/invoice", authenticateApiKey, controller.getInvoice);
router.get("/invoice/:id", authenticateApiKey, controller.getInvoiceById);
router.post(
  "/invoice/create-invoice",
  authenticateApiKey,
  validate(invoiceSchema),
  controller.createInvoice
);
router.put(
  "/invoice/update-invoice/:id",
  authenticateApiKey,
  validate(invoiceSchema),
  controller.updateInvoice
);
router.delete(
  "/invoice/delete-invoice/:id",
  authenticateApiKey,
  controller.deleteInvoice
);

module.exports = router;
