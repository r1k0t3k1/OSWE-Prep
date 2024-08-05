import Nanobar from "nanobar";
import 'bootstrap';
import 'bootstrap4-toggle'
import Controller from './controllers.js';
import io from 'socket.io-client';
import settings from '!../../application_settings.json';
require('../favicon/favicon.ico')
require('../img/logo.png')


$('[data-toggle="popover"]').popover({
  sanitize: false
})

var nanobar = new Nanobar( {
  classname: 'nanobar',
  id: 'nanobar',
} );

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

if (!settings.ws.enabled){
  $('.pluginToggle').each(function() {
    $(this).change(function() {
      window.location.href = '/plugin/'+ $(this).data("plugin") + '/' + $(this).prop('checked')
    })
  })
}

if($('#working-document')[0]){
    var easyMDE = new EasyMDE({
        autofocus: true,
        minHeight: "900px",
        autoDownloadFontAwesome: false,
        spellChecker: false,
        Element: $('#working-document')[0]
    });
    
}
if (settings.ws.enabled){
  var socket = io();

  socket.on('connect', function (data) {  
    socket.locals = {};
    //exported for plugins
    window.socket = socket;
    if(typeof loadPlugins === "function"){
      loadPlugins(socket, $)

    }
    var user = JSON.parse(localStorage.getItem("user"));
    if (user){
      socket.locals.user = user
    }
    configRoute(socket);
  });
}

function configRoute(socket){
  var router = new Navigo(null, true, '#!');
  var c = new Controller(socket, router, nanobar);
  router.hooks({
    before: function(done, params) {
      c.clear();
      done();
    }
  });
  router.on({
    '/home': () => { c.showHome(); },
    '/login': () => { c.showLogin(); },
    '/register': () => { c.showRegister(); },

  });
  router.on({
    '/logout': {uses: () => { c.logout(); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/d/delete/:id': { uses: (data) => { c.deleteDocument(data.id); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/document/delete/:id': { uses: (data) => { c.deleteDocument(data.id); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/d/:id': { uses: (data) => { c.document(data.id); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/document/:id': { uses: (data) => { c.document(data.id); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/d': { uses: () => { c.document(); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/document': { uses: () => { c.document(); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/profile': { uses: () => { c.showProfile(); }, hooks: {before: (next) => {c.authorize(next)}}},
    '/server': { uses: () => { c.showServer(); }, hooks: {before: (next) => {c.authorize(next)}}},
  })
  router.on(() => { c.showHome(); });
  router.notFound((query) => { c.notFound(); });
  router.resolve();
}