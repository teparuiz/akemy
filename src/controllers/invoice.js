const { sequelize } = require("../models/");
const Invoice = require("../models/init-models")(sequelize).invoice;
const models = require("../models/init-models")(sequelize);

exports.getInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();

    if (invoices.length === 0)
      return res.status(204).json({ message: "No hay facturas!" });

    return res.status(200).json({ message: "Facturas", data: invoices });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};

exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findByPk(id, {
      attributes: {
        exclude: ["customer_invoice_id", "invoice_row_invoice_id"],
      },
      include: [
        {
          model: models.invoice_row,
          as: "invoice_row",
          attributes: {
            exclude: ["invoice_row_invoice_id"],
          },
        },
        {
          model: models.customer,
          as: "customer",
          attributes: {
            exclude: ["customer_invoice_id", "customer_address_id"],
          },
          include: {
            model: models.addresses,
            as: "addresses",
            attributes: {
              exclude: ["customer_address_id"],
            },
          },
        },
      ],
    });

    if (!invoice) return res.status(204).json({ message: "No hay datos" });
    return res.status(200).json({ message: "Factura obtenida", data: invoice });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};

exports.createInvoice = async (req, res) => {
  const {
    items,
    status,
    date,
    type,
    description,
    discount,
    tax,
    total,
    uuid,
    payment_form,
    currency,
    customer,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const findUnique = await Invoice.findOne({
      where: {
        uuid: uuid,
      },
    });

    if (findUnique)
      return res.status(409).json({ message: "La factura ya existe" });

    const invoice = await Invoice.create(
      {
        status,
        date,
        type,
        description,
        discount,
        payment_form,
        tax,
        total,
        uuid,
        currency,
      },
      {
        transaction: t,
      }
    );

    if (items) {
      const invoiceRow = items.map((item) => {
        return {
          ...item,
          invoice_row_invoice_id: invoice.invoice_id,
        };
      });

      await models.invoice_row.bulkCreate(invoiceRow, {
        transaction: t,
      });
    }

    if (customer) {
      const customerInvoice = {
        legal_name: customer.legal_name,
        tax_id: customer.tax_id,
        customer_invoice_id: invoice.invoice_id,
      };

      const customerRes = await models.customer.create(customerInvoice, {
        transaction: t,
      });

      if (customerRes) {
        const address = {
          customer_address_id: customerRes.customer_id,
          street: customer.address ? customer.address.street : null,
          city: customer.address ? customer.address.city : null,
          state: customer.address ? customer.address.state : null,
          country: customer.address ? customer.address.country : null,
          zip: customer.address ? customer.address.zip : null,
          exterior: customer.address ? customer.address.exterior : null,
          interior: customer.address ? customer.address.interior : null,
        };

        await models.addresses.create(address, {
          transaction: t,
        });
      }
    }

    await t.commit();

    const invoiceDescription = await Invoice.findByPk(invoice.invoice_id, {
      include: [
        {
          model: models.invoice_row,
          as: "invoice_row",
          attributes: {
            exclude: ["invoice_row_invoice_id"],
          },
        },
        {
          model: models.customer,
          as: "customer",
          attributes: {
            exclude: ["customer_invoice_id", "customer_address_id"],
          },
          include: {
            model: models.addresses,
            as: "addresses",
            attributes: {
              exclude: ["customer_address_id"],
            },
          },
        },
      ],
    });

    return res
      .status(201)
      .json({ message: "Factura creada!", data: invoiceDescription });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};

exports.updateInvoice = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    date,
    type,
    description,
    discount,
    payment_form,
    tax,
    total,
    uuid,
    currency,
    customer,
    items,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    const invoice = await Invoice.findByPk(id, {
      transaction: t,
    });

    if (!invoice)
      return res.status(204).json({ message: "No existe esta factura!" });

    await invoice.update(
      {
        status,
        date,
        type,
        description,
        discount,
        payment_form,
        tax,
        total,
        uuid,
        currency,
      },
      {
        transaction: t,
      }
    );

    if (items) {
      const invoiceRow = items.map((item) => {
        return {
          ...item,
          invoice_row_invoice_id: invoice.invoice_id,
        };
      });

      await models.invoice_row.bulkCreate(invoiceRow, {
        transaction: t,
      });
    }

    if (customer) {
      const customerInvoice = {
        legal_name: customer.legal_name,
        tax_id: customer.tax_id,
        customer_invoice_id: invoice.invoice_id,
      };

      const customerRes = await models.customer.create(customerInvoice, {
        transaction: t,
      });

      if (customerRes) {
        const address = {
          customer_address_id: customerRes.customer_id,
          street: customer.address ? customer.address.street : null,
          city: customer.address ? customer.address.city : null,
          state: customer.address ? customer.address.state : null,
          country: customer.address ? customer.address.country : null,
          zip: customer.address ? customer.address.zip : null,
          exterior: customer.address ? customer.address.exterior : null,
          interior: customer.address ? customer.address.interior : null,
        };

        await models.addresses.create(address, {
          transaction: t,
        });
      }
    }

    const findInvoice = await Invoice.findByPk(invoice.invoice_id, {
      include: [
        {
          model: models.invoice_row,
          as: "invoice_row",
          attributes: {
            exclude: ["invoice_row_invoice_id"],
          },
        },
        {
          model: models.customer,
          as: "customer",
          attributes: {
            exclude: ["customer_invoice_id", "customer_address_id"],
          },
          include: {
            model: models.addresses,
            as: "addresses",
            attributes: {
              exclude: ["customer_address_id"],
            },
          },
        },
      ],
    });

    await t.commit();

    return res
      .status(200)
      .json({ message: "Factura actualizada", data: findInvoice });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};

exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;

  const t = await sequelize.transaction();

  try {
    const invoice = await Invoice.findByPk(id);

    if (!invoice) return res.status(204).json({ message: "No hay datos" });

    await invoice.destroy();

    await t.commit();

    return res
      .status(200)
      .json({ message: "Factura eliminada", invoice_id: invoice.invoice_id });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};
