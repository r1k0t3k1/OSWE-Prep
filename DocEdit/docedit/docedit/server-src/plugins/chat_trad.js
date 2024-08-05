
var pug = require('pug');
var CleanCSS = require('clean-css');
const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');
var fs = require('fs');
path = __dirname
module.exports = class Chat_Plugin {

	constructor(req, res) {
	  this.title = "Chat Plugin - Traditional"
	  this.description = "Chat Plugin, Requires \"Chat Plugin - WS\" to work"
	  this.type = "traditional"
	}
  
	main(req, res) {
		var html = pug.renderFile(path + "/chat/chat.pug")
		var css = new CleanCSS().minify([path + "/chat/chat.css"]);
		var js = '';

		try {
			if (fs.existsSync(path + "/chat/cache/chat.min.js")) {
			  js = fs.readFileSync(path + "/chat/cache/chat.min.js", 'utf8');
			  set()
			}else{
				minify({
					compressor: gcc,
					input: path + "/chat/chat.js",
					output: path + "/chat/cache/chat.min.js",
					callback: function(err, min) {
						js = min
						set()
					}
				  });
			}
		} catch(err) {
			console.error(err)
		}
		
		function set () {
			res.locals.plugin.html.push(html);
			res.locals.plugin.css.push(css.styles);
			res.locals.plugin.js.push(js);
		}
	}
  
}