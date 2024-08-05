var models  = require('../models');


module.exports = async function(req, res, next) {

	let token;
	if(!req.locals){
		req.locals = {}
	}
	req.locals.user = {};
	if (res) {
		token =
		req.cookies.auth_token || req.headers.authorization;
	}else if(req[1].token) {
		token = req.token
	}
	if (token) {
		const authToken = await models.AuthToken.findOne(
		  { where: { token }, include: models.User }
		);

		if (authToken) {
		  req.locals.user = authToken.User;
		  if (res){
			res.locals.user = authToken.User;
		  }
		  next();
		}else{
			next(new Error("User not authorized"))
		}
	  }else if (res.locals.settings.whitelisted.includes(req.path)){
		next();
	  }else{
 		 next(new Error("User not allowed to conduct that action"));
	  }
}