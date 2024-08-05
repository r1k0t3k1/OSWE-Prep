var models  = require('../models');
var pluginController = require(__dirname + '/../controllers/pluginController.js')

module.exports = async function(req, res, next) {
	await pluginController.enabledPlugins()
	.then(async (plugins) => {
		plugins.forEach(async (plugin) => {
			if (plugin.type === "traditional"){
				await pluginController.loadPlugin_traditional(plugin.location, req, res);
			}
		});
	});

  	next();
}