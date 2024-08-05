var models  = require('../models');


module.exports = async function(req, res, next) {

	if(res.locals.user ){
		const docs = await models.Document.findAll();
		res.locals.docs = docs
	}
  next();
}