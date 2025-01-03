const Invoice = require("../models/invoice");

exports.getInvoice = async (req, res) => {
    try {

      const invoices = await Invoice.findAll();

      if(invoices.length === 0) return res.status(204).json({ message: "Not invoices!" });


      return res.status(200).json({ message: "Invoice fetched", data: invoices });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.getInvoiceById = async (req, res) => {
    try {
      return res.status(200).json({ message: "Invoice fetched" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.createInvoice = async (req, res) => {
    try {
      return res.status(201).json({ message: "Invoice created" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.updateInvoice = async (req, res) => {
    try {
      return res.status(200).json({ message: "Invoice updated" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  exports.deleteInvoice = async (req, res) => {
    try {
      return res.status(200).json({ message: "Invoice deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  