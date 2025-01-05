const DataTypes = require("sequelize").DataTypes;

const _customer = require("./customer");
const _invoice_row = require("./invoice_row");
const _invoice = require("./invoice");
const _addresses = require("./addresses");

function initModels(sequelize) {
  const customer = _customer(sequelize, DataTypes);
  const invoice_row = _invoice_row(sequelize, DataTypes);
  const invoice = _invoice(sequelize, DataTypes);
  const addresses = _addresses(sequelize, DataTypes);

  // relaciones

  invoice.hasMany(invoice_row, {
    as: "invoice_row",
    foreignKey: "invoice_row_invoice_id",
  });

  invoice_row.belongsTo(invoice, {
    as: "invoice",
    foreignKey: "invoice_row_invoice_id",
  });

  invoice.hasOne(customer, {
    as: "customer",
    foreignKey: "customer_invoice_id",
  });

  customer.belongsTo(invoice, {
    as: "invoice",
    foreignKey: "customer_invoice_id",
  });

  customer.hasOne(addresses, {
    as: "addresses",
    foreignKey: "customer_address_id",
  });

  addresses.belongsTo(customer, {
    as: "customer",
    foreignKey: "customer_address_id",
  });

  return {
    customer,
    invoice_row,
    invoice,
    addresses,
  };
}

module.exports = initModels;
