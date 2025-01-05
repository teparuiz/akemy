const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "invoice",
    {
      invoice_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      customer_invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customer",
          key: "customer_id",
        },
      },
      invoice_row_invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "invoice_row",
          key: "invoice_row_id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discount: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      tax: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      payment_form: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "invoice",
      timestamps: false,
      indexes: [
        {
          name: "invoice_pkey",
          unique: true,
          fields: [{ name: "invoice_id" }],
        },
      ],
    }
  );
};
