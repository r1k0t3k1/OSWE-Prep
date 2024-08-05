require('dotenv').config()
const fs = require('fs');
let rawSettings = fs.readFileSync('application_settings.json');
let appSettings = JSON.parse(rawSettings);

module.exports = {
	development:{
		database: process.env.MYSQL_DATABASE,
		username: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		host: process.env.MYSQL_HOST,
		dialect: 'mysql',
		domain: process.env.DOMAIN,
		debug: stringToBoolean(process.env.DEBUG)
	},
	appSettings
} 


function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(string);
    }
}