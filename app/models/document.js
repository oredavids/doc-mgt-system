module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    OwnerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    access: {
      defaultValue: 'public',
      type: DataTypes.STRING,
      validate: {
        isIn: [['private', 'public', 'role']]
      }
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        Document.belongsTo(models.User, {
          as: 'Owner',
          onDelete: 'CASCADE',
          foreignKey: { allowNull: true }
        });
      }
    }
  });
  return Document;
};
