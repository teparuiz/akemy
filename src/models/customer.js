const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "customer",
    {
      customer_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      customer_invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      legal_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tax_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      invoice_customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customer",
          key: "customer_id",
        },
      },
    },
    {
      sequelize,
      tableName: "customer",
      timestamps: false,
      indexes: [
        {
          name: "customer_pkey",
          unique: true,
          fields: [{ name: "customer_id" }],
        },
      ],
    }
  );
};
