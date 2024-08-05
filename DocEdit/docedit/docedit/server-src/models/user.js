'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email: {type: DataTypes.STRING, unique: true},
    password: {
      type: DataTypes.STRING,
      set(value){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(value, salt);

        this.setDataValue('password', hash);
      }
    }
  }, {});
  User.associate = function({ AuthToken, Document, DocumentTag}) {
    User.hasMany(AuthToken);
    User.belongsToMany(Document, { through: DocumentTag })
  };
  User.authenticate = async function(email, password) {
    const user = await User.findOne({ where: { email } });
    if (bcrypt.compareSync(password, user.password)) {
      return user.authorize();
    }

    throw new Error('invalid password');
  }

  User.prototype.authorize = async function () {
    const { AuthToken } = sequelize.models;
    const user = this

    // create a new auth token associated to 'this' user
    // by calling the AuthToken class method we created earlier
    // and passing it the user id
    const authToken = await AuthToken.generate(this.id);

    // addAuthToken is a generated method provided by
    // sequelize which is made for any 'hasMany' relationships
    await user.addAuthToken(authToken);

    return { user, authToken }
  };

  User.prototype.logout = async function (token) {

    // destroy the auth token record that matches the passed token
    sequelize.models.AuthToken.destroy({ where: { token } });
  };

  return User;
};