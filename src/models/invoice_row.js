module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "invoice_row",
    {
      invoice_row_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      invoice_row_invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "invoice",
          key: "invoice_id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      unit_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      unit_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tax: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "invoice_row",
      timestamps: false,
      indexes: [
        {
          name: "invoice_row_pkey",
          unique: true,
          fields: [{ name: "invoice_row_id" }],
        },
      ],
    }
  );
};
