'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pages = sequelize.define('Pages', {
    location: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Pages.associate = function(models) {
    // associations can be defined here
  };
  return Pages;
};