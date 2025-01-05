module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "addresses",
    {
      address_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      customer_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customer",
          key: "customer_id",
        },
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      exterior: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interior: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      neighborhood: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "addresses",
      timestamps: false,
      indexes: [
        {
          name: "address_pkey",
          unique: true,
          fields: [{ name: "address_id" }],
        },
      ],
    }
  );
};
