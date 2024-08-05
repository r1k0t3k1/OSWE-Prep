var express = require('express');
var router = express.Router();
var userController = require(__dirname + '/../controllers/userController.js')
var docController = require(__dirname + '/../controllers/docController.js')
var pageController = require(__dirname + '/../controllers/pageController.js')
var pluginController = require(__dirname + '/../controllers/pluginController.js')
var authorize = require(__dirname + '/../helpers/authorize.js')
var pug = require('pug');

/* GET home page. */
router.get('/', async function(req, res, next) {
  await pageController.getHome()
  .then((page) => {
    home = pug.render(page ,{ title: 'Home'})
    res.render('index', { title: 'Home', homePage: home });
  }).catch((err) => {
    next(err)
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
  userController.login(req.body.email, req.body.password)
  .then((user) => {
    res.cookie('auth_token', user.authToken.token, { httpOnly: true })
    res.redirect('/d')
  })
  .catch((error) => {
    next(error)
  });
});

router.get('/logout', async function(req, res, next) {
  const { locals: {user: user}, cookies: { auth_token: authToken } } = req
  if (user && authToken) {
    await req.locals.user.logout(authToken);
    res.cookie('auth_token', '', {expires: new Date(Date.now() - 1000)})
    return res.redirect('/login')
  }
  return next(new Error("Not Logged in."))
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
  userController.register(req.body.firstName, req.body.lastName, req.body.email,req.body.password1,req.body.password2)
  .then((data) => { 
    res.redirect('/login')
  })
  .catch((error) => {
    next(error)
  });
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Edit Profile' });
});

router.post('/profile/update', function(req, res, next) {
  userController.update(req.locals.user, req.body.firstName, req.body.lastName, req.body.email,req.body.password1,req.body.password2)
  .then((data) => { 
    res.redirect('/profile')
  })
  .catch((error) => {
    next(error)
  });
});

router.get(['/document','/d'], function(req, res, next) {
  res.render('document', { title: 'New Document', doc: null});
});

router.post(['/document','/d'], function(req, res, next) {
  docController.save(req.body.id, req.body.title, req.body.content)  
  .then((doc) => {
    res.redirect('/d/' + doc.id)
  })
  .catch((error) => {
    next(error)
  })
});

router.get(['/document/:docid','/d/:docid'], async function(req, res, next) {
  var doc = await docController.get(req.params.docid)
  res.render('document', {doc: doc});
});

router.get(['/document/delete/:docid','/d/delete/:docid'], async function(req, res, next) {
  await docController.del(req.params.docid)
  .then(() => {
    res.redirect('/d')
  }).catch((err) => {
    next(err)
  });
});

router.get('/server', authorize(), async function(req, res, next) {
  await pageController.getHome()
  .then(async (page) => {
    await pluginController.allPlugins()
    .then((plugins) => {
      res.render('settings', { 
        title: 'Settings', 
        homeContent: page,
        plugins
       });
    })
    .catch((err) => {
      next(err)
    })
  }).catch((err) => {
    next(err)
  });
});

router.post('/server', authorize(), async function(req, res, next) {
  await pageController.saveHome(req.body.homePage)
  .then(() => {
    res.redirect('/server')
  }).catch((err) => {
    next(err)
  });

});

router.get('/plugin/:name/:enable', authorize(), async function(req, res, next) {

  await pluginController.togglePlugin(req.params.name, req.params.enable)
  .then(() => {
    res.redirect('/server')
  })
  .catch((err) => {
    next(err)
  })

});

router.post(['/document/tag/:docid','/d/tag/:docid'], async function(req, res, next) {

  userController.findByEmail(req.body.email)
  .then((user) => {
    docController.tag(user.id, req.params.docid)  
    .then((tag) => {
      res.redirect('/d/' + req.params.docid)
    })
    .catch((error) => {
      next(error)
    })
  })
  .catch((err) => {
    next(err)
  })


});

module.exports = router;
