import View from './view.js';
import Utils from './utils.js'
import User from './Models/user.js'
import toastr from 'toastr';
import Push from 'push.js'

var utils = new Utils();

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
export default class Controller {
    constructor(socket, router, loadingBar) {
        this.v = new View(this);
        this.socket = socket;
        this.router = router;
        this.loadingBar = loadingBar;
        this.v.set_ws_view()
        this.registerGeneric();
      }
    clear() {
        this.v.clear();
    }
    authorize(next) {
        if(typeof this.socket.locals.user == 'undefined'){
            this.router.navigate("/login")
        }else{
            next();
        }
    }
    showHome() {
        this.socket.emit('getHome');
        this.loadingBar.go( 30 );
        if(!this.socket._callbacks["$homepage"]){
            this.socket.on('homePage', function(data) {
                this.v.home(data)
                this.loadingBar.go( 100 );
            }.bind({v: this.v, loadingBar: this.loadingBar}))
        }
    }
    showLogin() {
        this.socket.emit('getLogin');
        this.loadingBar.go( 30 );
        if(!this.socket._callbacks["$loginPage"]){
            this.socket.on('loginPage', function(data) {
                this.v.login(data)
                this.loadingBar.go( 100 );
            }.bind({v: this.v, loadingBar: this.loadingBar}))
        }
    }
    showProfile() {
        this.socket.emit('getProfileEdit', {token: this.socket.locals.user.token});
        this.loadingBar.go( 30 );
        if(!this.socket._callbacks["$profilePage"]){
            this.socket.on('profilePage', function(data) {
                this.v.profile(data)
                this.loadingBar.go( 100 );
            }.bind({v: this.v, loadingBar: this.loadingBar}))
        }
    }
    showServer() {
        this.socket.emit('getServer', {token: this.socket.locals.user.token});
        this.loadingBar.go( 30 );
        if(!this.socket._callbacks["$serverPage"]){
            this.socket.on('serverPage', function(data) {
                this.v.server(data)
                this.loadingBar.go( 100 );
            }.bind({v: this.v, loadingBar: this.loadingBar}))
        }
    }
    postLogin(data) {
        this.socket.emit('postLogin', utils.objectifyForm(data))
        this.loadingBar.go( 30 );
        if(!this.socket._callbacks["$user"]){
            this.socket.on('user', function(data) {
                this.loadingBar.go( 100 );
                var user = new User(data)
                localStorage.setItem("user", JSON.stringify(user));
                if (!this.socket.locals){
                    this.socket.locals = {};
                }
                this.socket.locals.user = user
                this.v.set_ws_view()
            }.bind({socket: this.socket, v: this.v, loadingBar: this.loadingBar}))
        }
    }
    updateProfile(data){
        data = utils.objectifyForm(data)
        data.token = this.socket.locals.user.token
        this.socket.emit('updateProfile', data)
        this.loadingBar.go( 30 );
    }
    updateSettings(data) {
        data = utils.objectifyForm(data)
        data.token = this.socket.locals.user.token
        this.socket.emit('updateSettings', data)
        this.loadingBar.go( 30 );
    }
    document(id) {
        this.loadingBar.go( 30 );
        if (id){
            this.socket.emit('getDocument', {id: id, token: this.socket.locals.user.token});
        }else{
            this.socket.emit('getDocumentPage',{token: this.socket.locals.user.token});
        }
    }
    deleteDocument(id) {
        this.loadingBar.go( 30 );
        this.socket.emit('deleteDocument', {id: id, token: this.socket.locals.user.token});
    }
    togglePlugin(name, enable) {
        this.loadingBar.go( 30 );
        this.socket.emit('togglePlugin', {name, enable, token: this.socket.locals.user.token});
    }
    saveDocument(data) {
        this.loadingBar.go( 30 );
        data = utils.objectifyForm(data)
        data.token = this.socket.locals.user.token
        this.socket.emit('saveDocument',data);
    }
    addTag(data) {
        this.loadingBar.go( 30 );
        data = utils.objectifyForm(data)
        data.token = this.socket.locals.user.token
        this.socket.emit('addTag',data);
    }
    
    logout() {
        this.socket.locals.user = null;
        localStorage.removeItem("user")
        this.v.set_ws_view();
        this.router.navigate("/login")
        this.socket.emit('logout');
        this.getNavbar();
    }
    showRegister() {
        this.loadingBar.go( 30 );
        this.socket.emit('getRegister');
        if(!this.socket._callbacks["$registerPage"]){
            this.socket.on('registerPage', function(data) {
                this.loadingBar.go( 100 );
                this.v.register(data)
            }.bind({v: this.v, loadingBar: this.loadingBar}))
        }
    }
    postRegister(data) {
        this.loadingBar.go( 30 );
        this.socket.emit('postRegister', utils.objectifyForm(data))
    }
    notFound() {
        this.v.notFound();
    }
    getSidebar() {
        this.socket.emit('getSidebar', {token: this.socket.locals.user.token})
    }
    getNavbar() {
        if (this.socket.locals.user){
            this.socket.emit('getNavbar', {token: this.socket.locals.user.token})
        }
        else{
            this.socket.emit('getNavbar')
        }
    }
    checkEmail(email) {
        if (email !== ''){
            this.socket.emit('checkEmail', {token: this.socket.locals.user.token, email})
            if(!this.socket._callbacks["$emailFound"]){
                this.socket.on('emailFound', function(valid) {
                    this.v.toggleValidEmail(valid)
                  }.bind({v: this.v}))
            }
        }else{
            this.v.toggleValidEmail(false)
        }
    }
    registerGeneric(){
        this.socket.on('message', function(data) {
            this.loadingBar.go( 100 );
            switch (data.type) {
                case "success":
                    toastr.success(data.message, 'Success!')
                    break;
                case "error":
                    toastr.error(data.message, 'Error!')
                    break;
                default:
                    toastr.info(data.message, 'Info!')
                    break;
            }
            if (data.redirect){
                this.router.navigate(data.redirect);
            }
        }.bind({router: this.router, loadingBar: this.loadingBar}))

        this.socket.on('sidebar', function(data) {
            this.v.sidebar(data)
        }.bind({v: this.v}))
        
        this.socket.on('navbar', function(data) {
            this.v.navbar(data)
        }.bind({v: this.v}))

        this.socket.on('notification', function(data) {
            Push.create(data.title, {
                body: data.msg,
                icon: '/favicon.ico',
                timeout: 4000,
                onClick: function () {
                    window.focus();
                    this.close();
            }}).catch((err) => {
                toastr.success(data.msg, data.title)
            })
        })

        this.socket.on('documentPage', function(data) {
            this.loadingBar.go( 100 );
            this.v.document(data.html)
            var url = this.router.lastRouteResolved().url;
            if (data.id && (url === "/d" || url === "//d" || url === "/document" || url === "//document")){
                this.getSidebar();
                this.router.navigate("/d/" + data.id)
            }
            
          }.bind(this))
    }
    
}