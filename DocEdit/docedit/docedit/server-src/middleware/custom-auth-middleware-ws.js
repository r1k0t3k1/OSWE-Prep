var models  = require('../models');


module.exports = async function(socket, packet, next) {

	let token;
	if(!socket.locals){
		socket.locals = {}
	}
	if (packet[1]) {
		if (packet[1].token){
			token = packet[1].token
		}
	}
	if (token) {
		const authToken = await models.AuthToken.findOne(
		  { where: { token }, include: models.User }
		);

		if (authToken) {
			socket.locals.user = {};
			socket.locals.user = authToken.User;
			socket.join(token);
			next()
		}else{
			socket.emit('message', {type: "error", message: "User not found"});
		}
	}else if(socket.locals.settings.whitelisted.includes(packet[0])){
		next();
	}else {
		socket.emit('message', {type: "error", message: "User not allowed to conduct that action"});
	}
}