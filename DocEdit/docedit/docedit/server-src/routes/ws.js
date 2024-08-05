var models  = require('../models');
var pageController = require(__dirname + '/../controllers/pageController.js');
var userController = require(__dirname + '/../controllers/userController.js');
var docController = require(__dirname + '/../controllers/docController.js');
var pluginController = require(__dirname + '/../controllers/pluginController.js');
var authorize = require(__dirname + '/../helpers/authorize-ws.js');


var pug = require('pug');


module.exports = async function(socket, app, io) {
	socket.on('getHome',  async function(data) {
		await pageController.getHome()
		.then((page) => {
		  context = socket.locals;
		  context.title = 'Home'
		  html = pug.render(page,context)
		  socket.emit('homePage', html);
		}).catch((err) => {
		  socket.emit('message', {type: "error", message: err.message});
		});
	});

	socket.on('getLogin', function(data) {
		context = socket.locals;
		context.title = 'Login'
		app.render('items/login_el', context,
		  function(err, html) {
			socket.emit('loginPage', html);
		  });
	});

	socket.on('getRegister', function(data) {
		context = socket.locals;
		context.title = 'Register'
		app.render('items/register_el', context,
		  function(err, html) {
			socket.emit('registerPage', html);
		  });
	});

	socket.on('getServer', async function(data) {
		await authorize(socket)
		.then(async () => {
			await pageController.getHome()
			.then(async (page) => {
				await pluginController.allPlugins()
				.then((plugins) => {
					context = socket.locals;
					context.title = 'Settings'
					context.homeContent= page
					context.plugins = plugins
					app.render('items/settings_el',context,
					function(err, html) {
					  socket.emit('serverPage', html);
					});
				})
				.catch((err) => {
					socket.emit('message', {type: "error", message: err.message});
				})
			}).catch((err) => {
			  socket.emit('message', {type: "error", message: err.message});
			});
		})
		.catch((error) => {
			socket.emit('message', {type: "error", message: error.message});
		  })
	});

	socket.on('getDocumentPage', function(data) {
		context = socket.locals;
		context.title = 'Document'
		context.doc = null;
		app.render('items/document_el',context,
		  function(err, html) {
			socket.emit('documentPage', {html: html});
		  });
	});

	socket.on('getSidebar', function(data) {
		context = socket.locals;
		app.render('sidebar', context,
		function(err, html) {
		  if (err){
			socket.emit('message', {type: "error", message: err.message});
		  }
		  socket.emit('sidebar', html);
		});
	});

	socket.on('getNavbar', function(data) {
		context = socket.locals;
		app.render('navbar', context,
		function(err, html) {
		  if (err){
			socket.emit('message', {type: "error", message: err.message});
		  }
		  socket.emit('navbar', html);
		});
	});

	socket.on('getDocument', async function(data) {
		sendDocument(data.id)
	});

	socket.on('getProfileEdit', async function(data) {
		context = socket.locals;
		context.title = 'Edit Profile'
		app.render('items/profile_el', context,
		  function(err, html) {
			socket.emit('profilePage', {html: html});
		  });
	});



	socket.on('postRegister', function(data) {
		userController.register(data.firstName, data.lastName, data.email,data.password1,data.password2)
		.then((data) => {
		  socket.emit('message', {type: "success", message: "Your user was registered.", redirect: "/login"});
		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		});
	});

	socket.on('postLogin', function(data) {
		userController.login(data.email, data.password)
		.then((data) => {
		  socket.emit('user', {
			firstName: data.user.firstName,
			lastName: data.user.lastName,
			token: data.authToken.token,
		  });
		  socket.emit('message', {type: "success", message: "You have successfully logged in.", redirect: "/d"});
		  socket.join(data.authToken.token);
		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		});
	});

	socket.on('logout', function(data) {
		socket.locals.user = null;
		socket.emit('message', {type: "success", message: "You have successfully logged out.", redirect: "/login"});
	});

	socket.on('saveDocument', function(data) {
		docController.save(data.id, data.title, data.content)
		.then((doc) => {
		  socket.emit('message', {type: "info", message: "Document saved"});
		  context = socket.locals;
		  context.title = 'Document'
		  context.doc = doc
		  app.render('items/document_el', context,
		  function(err, html) {
			socket.emit('documentPage', {html: html, id: doc.id});
		  });
		  docController.notify(socket, doc, io)

		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		})
	});

	socket.on('deleteDocument', async function(data) {
		await docController.del(data.id)
		.then(async () => {
		  socket.emit('message', {type: "success", message: "Document deleted", redirect: "/d"});
		  await models.Document.findAll()
		  .then((data) => {
			context = socket.locals;
			context.docs = data
			app.render('sidebar', context,
			function(err, html) {
			  if (err){
				socket.emit('message', {type: "error", message: err.message});
			  }
			  socket.emit('sidebar', html);
			});
		  });
		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		})
	});

	socket.on('checkEmail', async function(data) {
		userController.searchByEmail(data.email)
		.then((found) => {
		  socket.emit('emailFound', found);
		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		});
	});

	socket.on('addTag', async function(data) {
		userController.findByEmail(data.email)
		.then((user) => {
		  docController.tag(user.id, data.docid)
		  .then((tag) => {
			socket.emit('message', {type: "success", message: "Your user added to tag"});
			sendDocument(data.docid)
		  })
		  .catch((error) => {
			socket.emit('message', {type: "error", message: error.message});
		  })
		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		})
	});

	socket.on('updateProfile', async function(data) {
		userController.update(socket.locals.user, data.firstName, data.lastName, data.email,data.password1,data.password2)
		.then((data) => {
		  socket.emit('message', {type: "success", message: "Your user was updated."});
		})
		.catch((error) => {
		  socket.emit('message', {type: "error", message: error.message});
		});
	});

	socket.on('updateSettings', async function(data) {
		await authorize(socket)
		.then(async () => {
			await pageController.saveHome(data.homePage)
			.then(() => {
			  socket.emit('message', {type: "success", message: "Your settings were updated"});
			}).catch((err) => {
			  socket.emit('message', {type: "error", message: err.message});
			});
		})
		.catch((error) => {
			socket.emit('message', {type: "error", message: error.message});
		  })
	});

	socket.on('togglePlugin', async function(data) {
		await authorize(socket)
		.then(async () => {
			await pluginController.togglePlugin(data.name, data.enable)
			.then(() => {
				socket.emit('message', {type: "success", message: "Plugin Toggled, you may have to refresh the web page"});
			})
			.catch((err) => {
			  next(err)
			})
		})
		.catch((error) => {
			socket.emit('message', {type: "error", message: error.message});
		  })
	});

	async function sendDocument(docid){
		context = socket.locals;
		context.title = 'Document'
		context.doc = await docController.get(docid)
		app.render('items/document_el', context,
		  function(err, html) {
			socket.emit('documentPage', {html: html});
		  });
	}
}

