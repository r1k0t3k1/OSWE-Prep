'use strict';
module.exports = (sequelize, DataTypes) => {
  const DocumentTag = sequelize.define('DocumentTag', {
    purpose: DataTypes.STRING
  }, {});
  DocumentTag.associate = function(models) {
    // associations can be defined here
  };

  DocumentTag.tag = async function(UserId, DocumentId) {
    if (!UserId && !DocumentId) {
      throw new Error('UserID and DocumentID is required')
    }

    return DocumentTag.create({ type: 'notification', UserId, DocumentId})
  }
  return DocumentTag;
};