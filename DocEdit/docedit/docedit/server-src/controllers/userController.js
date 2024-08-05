var models  = require('../models');
const { QueryTypes } = require('sequelize');

const register = async (firstName, lastName, email, password1, password2) =>  {
	if (password1 === password2)
	{
		password = password1
	}else{
		throw new Error("Passwords don't match");
	}
	await models.User.create({
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: password
	  }).then(function() {
		return true;
	  }).catch(function(err) {
		throw new Error("User with that email already exists");
	});
}

const login = async (email, password) =>  {
	try {
		let user = await models.User.authenticate(email, password)
		return user;
	  } catch (err) {
		throw new Error("Invalid username or password")
	  }
}

const update = async (user, firstName, lastName, email, password1, password2, isAdmin) =>  {
	if(password1){
		if (password1 === password2)
		{
			password = password1
			user.password = password
		}else{
			throw new Error("Passwords don't match");
		}
	}
	if (isAdmin){
		user.admin = isAdmin;
	}
	user.firstName = firstName;
	user.lastName = lastName;
	user.email = email;
	await user.save()
	.then(() => {
		return true;
	})
	.catch((err) => {
		throw err;
	});
}

const findByEmail = async (email) =>  {
	try {
		const user = await models.User.findOne({ where: { email } });
		if (user){
			return user;
		}else{
			throw new Error("User not found")
		}
	  } catch (err) {
		throw new Error("User not found")
	  }
}

const searchByEmail = async (email) =>  {
	try {
		const user = await models.sequelize.query("SELECT * FROM `Users` WHERE email LIKE '" + email + "%'", { type: QueryTypes.SELECT });
		if (user.length > 0){
			return true
		}else{
			return false
		}
	  } catch (err) {
		throw new Error("Something went wrong during the query")
	  }
}

module.exports = {register, login, update, findByEmail,searchByEmail}