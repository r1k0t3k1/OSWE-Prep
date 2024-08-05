var models  = require('../models');


module.exports = async function(socket, packet, next) {

	if(socket.locals ){
		if(socket.locals.user){
			const docs = await models.Document.findAll();
			socket.locals.docs = docs
		}
	}
	next()
}