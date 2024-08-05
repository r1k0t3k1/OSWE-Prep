var models  = require('../models');
var fs = require('fs');
const saveHome = async (content) =>  {
	const blacklist = ["- ","require", "child_process"];

	if(blacklist.some(v => content.includes(v))){
		throw new Error("Keyword is not allowed")
	}
	const page = await models.Pages.findOne(
		{ where: { location: 'home' } }
	);

	if(!page){
		await models.Pages.create({
			location: 'home',
			content: content,
		  }).then(function(data) {
			return data
		  }).catch(function(err) {
			throw new Error("Something went wrong saving your page");
		});
	}else{
		page.content = content;
		page.save();
		return page
	}

}

const getHome = async () =>  {

	const page = await models.Pages.findOne(
		{ where: { location: 'home' } }
	);

	if (page){
		return page.content;
	}else{
		let location = __dirname + "/../views/items/home_el.pug";
		return fs.readFileSync(location, 'utf8',)
	}
}

module.exports = {saveHome, getHome}