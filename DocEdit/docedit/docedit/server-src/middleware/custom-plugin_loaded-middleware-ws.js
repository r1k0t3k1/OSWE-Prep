var models  = require('../models');
var pluginController = require(__dirname + '/../controllers/pluginController.js')

module.exports = async function(socket, next) {
	await pluginController.enabledPlugins()
	.then(async (plugins) => {
		plugins.forEach(async (plugin) => {
			if (plugin.type === "ws"){
				await pluginController.loadPlugin_ws(plugin.location, socket);
			}
		});
	});

  	next();
}