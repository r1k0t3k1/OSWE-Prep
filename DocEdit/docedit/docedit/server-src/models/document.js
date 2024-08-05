'use strict';
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {});
  Document.associate = function({User, DocumentTag}) {
    Document.belongsToMany(User, { through: DocumentTag })

  };
  return Document;
};