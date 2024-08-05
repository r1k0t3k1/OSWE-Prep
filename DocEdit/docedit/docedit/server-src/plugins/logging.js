module.exports = class Verbose_Logging {

	constructor() {
	  this.title = "Plugin to Enable Verbose Logging"
	  this.description = "WARNING: Adds a lot of information to the console."
	  this.type = "traditional"
	}
  
	main(req, res) {
	  console.log(req)
	}
  
}