const { sequelize } = require("../models/");
const Invoice = require("../models/init-models")(sequelize).invoice;
const models = require("../models/init-models")(sequelize);

exports.getInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      attributes: {
        exclude: ["customer_invoice_id", "invoice_row_invoice_id"],
      },
    });

    if (invoices.length === 0)
      return res.status(204).json({ message: "No hay facturas!" });

    return res.status(200).json({ message: "Facturas", data: invoices });
  } catch (error) {
    console.log(error)
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

    return res
      .status(201)
      .json({ message: "Factura creada!", data: invoiceDescription });
  } catch (error) {
    console.log(error)
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

    const updatedFields = {};
    if (status !== invoice.status) updatedFields.status = status;
    if (date !== invoice.date) updatedFields.date = date;
    if (type !== invoice.type) updatedFields.type = type;
    if (description !== invoice.description)
      updatedFields.description = description;
    if (discount !== invoice.discount) updatedFields.discount = discount;
    if (payment_form !== invoice.payment_form)
      updatedFields.payment_form = payment_form;
    if (tax !== invoice.tax) updatedFields.tax = tax;
    if (total !== invoice.total) updatedFields.total = total;
    if (uuid !== invoice.uuid) updatedFields.uuid = uuid;
    if (currency !== invoice.currency) updatedFields.currency = currency;

    if (Object.keys(updatedFields).length > 0) {
      await invoice.update(updatedFields, { transaction: t });
    }

    if (items) {
      await models.invoice_row.destroy({
        where: { invoice_row_invoice_id: invoice.invoice_id },
        transaction: t,
      });

      const invoiceRow = items.map((item) => ({
        ...item,
        invoice_row_invoice_id: invoice.invoice_id,
      }));

      await models.invoice_row.bulkCreate(invoiceRow, { transaction: t });
    }

    if (customer) {
      const existingCustomer = await models.customer.findOne({
        where: { customer_invoice_id: invoice.invoice_id },
        transaction: t,
      });

      if (existingCustomer) {
        if (
          customer.legal_name !== existingCustomer.legal_name ||
          customer.tax_id !== existingCustomer.tax_id
        ) {
          await existingCustomer.update(
            {
              legal_name: customer.legal_name,
              tax_id: customer.tax_id,
            },
            { transaction: t }
          );
        }
      } else {
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
            street: customer.address?.street,
            city: customer.address?.city,
            state: customer.address?.state,
            country: customer.address?.country,
            zip: customer.address?.zip,
            exterior: customer.address?.exterior,
            interior: customer.address?.interior,
          };

          await models.addresses.create(address, { transaction: t });
        }
      }
    }

    await t.commit();

    const findInvoice = await Invoice.findByPk(invoice.invoice_id, {
      attributes: {
        exclude: ["customer_invoice_id", "invoice_row_invoice_id"],
      },
      include: [
        {
          model: models.invoice_row,
          as: "invoice_row",
          attributes: { exclude: ["invoice_row_invoice_id"] },
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
            attributes: { exclude: ["customer_address_id"] },
          },
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "Factura actualizada", data: findInvoice });
  } catch (error) {
    console.log(error)
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
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: models.invoice_row,
          as: "invoice_row",
        },
        {
          model: models.customer,
          as: "customer",
        },
      ],
      transaction: t,
    });

    if (!invoice) return res.status(204).json({ message: "No hay datos" });

    await models.invoice_row.destroy({
      where: { invoice_row_invoice_id: invoice.invoice_id },
      transaction: t,
    });

    await models.customer.destroy({
      where: { customer_invoice_id: invoice.invoice_id },
      transaction: t,
    });

    await models.addresses.destroy({
      where: { customer_address_id: invoice.customer.customer_address_id },
      transaction: t,
    });

    await invoice.destroy({ transaction: t });

    await t.commit();

    return res
      .status(200)
      .json({ message: "Factura eliminada", invoice_id: invoice.invoice_id });
  } catch (error) {

    console.log(error)
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};
