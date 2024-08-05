'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plugins = sequelize.define('Plugins', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    location: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },    
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      set(value){
        var name = value.split('.js').shift()
        this.setDataValue('fileName', name);
      },
      get() {
        return fileName + ".js";
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  Plugins.associate = function(models) {
    // associations can be defined here
  };
  return Plugins;
};