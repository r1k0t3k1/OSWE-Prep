var models  = require('../models');
var fs = require('fs');
var path = __dirname + "/../plugins/"

const loadPluginsToDB = async (content) =>  {
	fs.readdir(path, async function(err, items) {	 
		for (var i=0; i<items.length; i++) {
			if (items[i].endsWith(".js")){
				location = path + items[i]
				var requiredObj = async function(obj){
					Plugin = obj;
					plugin = new Plugin();
					await models.Plugins.upsert({
						title: plugin.title,
						description: plugin.description,
						type: plugin.type,
						location: path + items[i],
						fileName: items[i]
					}).then(function(data) {
						return data
					}).catch(function(err) {
						throw err;
					})
				}
				safeRun(requiredObj, location)
			}
		}
	});

}
const allPlugins = async () =>  {
	return await models.Plugins.findAll()
}
const enabledPlugins = async () =>  {
	return await models.Plugins.findAll({ where: { enabled: true } })
}

const loadPlugin_traditional = async (location,req, res) =>  {
	var requiredObj = async function(obj){
		Plugin = new obj();
		return Plugin.main(req,res)
	}
	try {
		safeRun(requiredObj, location)
	} catch (error) {
		throw error
	}
}

const loadPlugin_ws = async (location,socket) =>  {

	var requiredObj = async function(obj){
		Plugin = new obj();
		return Plugin.main(socket)
	}
	safeRun(requiredObj, location)
}

const togglePlugin = async (name,enable) =>  {
	location = path + name
	enable = (enable == 'true' || enable == true);
	var requiredObj = async function(obj){
		Plugin = obj;
		plugin = new Plugin();
		await models.Plugins.upsert({
			title: plugin.title,
			description: plugin.description,
			type: plugin.type,
			location: location,
			enabled: enable,
			fileName: name
		}).then(function(data) {
			return data
		}).catch(function(err) {
			throw err;
		})
	}
	safeRun(requiredObj, location)
}

const safeRun = async (callback, location ) => {
	const blacklist = ["require", "child_process"];

	if (blacklist.some(v => location.includes(v))) {
		throw new Error("That keyword is not allowed")
	} else {
		code = "delete require.cache[require.resolve('" + location + "')];"
		code += "require('" + location + "');"
		callback(eval(code))
	}
}
module.exports = {loadPluginsToDB, enabledPlugins, loadPlugin_traditional, loadPlugin_ws, allPlugins, togglePlugin}