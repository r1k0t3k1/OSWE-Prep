var models  = require('../models');

const save = async (id, title, content) =>  {

	if (id){
		doc = await get(id);
		doc.title = title;
		doc.content = content;
		doc.save();
	}else{
		doc = await models.Document.create({
			title: title,
			content: content,
		  }).then(function(data) {
			return data
		  }).catch(function(err) {
			throw new Error("Something went wrong saving your document");
		});
	}
	return doc;
}

const get = async (id) =>  {

	const doc = await models.Document.findOne(
		{ where: { id }, include: models.User }
	);

	if (doc){
		return doc;
	}
}

var del = async (id) =>  {

	const doc = await models.Document.findOne(
		{ where: { id } }
	);

	if (doc){
		await doc.destroy();
	}else{
		throw new Error("Document not found!")
	}
}

const tag = async (userId, documentId) =>  {
	return await models.DocumentTag.tag(userId, documentId)
}

const notify = async (socket, document, io) =>  {
	document.Users.forEach(u => {
		u.getAuthTokens().then((tokens) =>{
			tokens.forEach((t) => {
				io.to(t.token).emit('notification', {title: "Document Updated!", msg: document.title + " was updated!"});
			})
		})
	});
	
}

module.exports = {save, get, del, tag, notify}