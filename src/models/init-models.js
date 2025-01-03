const DataTypes = require("sequelize").DataTypes;

const _customer = require("./customer");
const _invoice_row = require("./invoice_row");
const _invoice = require("./invoice");

function initModels(sequelize) {
  const customer = _customer(sequelize, DataTypes);
  const invoice_row = _invoice_row(sequelize, DataTypes);
  const invoice = _invoice(sequelize, DataTypes);

  // relaciones

  invoice.hasMany(invoice_row, {
    as: "invoice_row",
    foreignKey: "invoice_row_invoice_id",
  });

  // uno a muchos
  invoice_row.belongsTo(invoice, {
    as: "invoice",
    foreignKey: "invoice_row_invoice_id",
  });

  invoice.belongsTo(customer, {
    as: "customer",
    foreignKey: "invoice_customer_id",
  });

  return {
    customer,
    invoice_row,
    invoice,
  };
}

module.exports = initModels;
