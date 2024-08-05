export default class View {

    constructor(controller) {
        this.c = controller;
    }
    set_ws_view() {
        $("#home_link").attr('href','/#!/home')
        $("#newDocument_link").attr('href','/#!/d')
        $("#login_link").attr('href','/#!/login')
        $("#logout_link").attr('href','/#!/logout')
        $("#profile_link").attr('href','/#!/profile')
        this.c.getNavbar();
        if (this.c.socket.locals.user){
            var loginbtn = $("#login_link")
            loginbtn.attr('id','logout_link')
            loginbtn.attr('href','/#!/logout')
            loginbtn.html('Logout')
            $("#account_dropdown").css("display", "block");
            this.c.getSidebar();
        }else{
            var logoutbtn = $("#logout_link")
            logoutbtn.attr('id','login_link')
            logoutbtn.attr('href','/#!/login')
            $("#account_dropdown").css("display", "none");
            logoutbtn.html('Login')
        }
    }
    clear(){
        $('#tagPopover').popover('hide');
    }
    home(data) {
        this.setHTML(data)
    }

    sidebar(data) {
        $('#sidebar-wrapper').html(data);
    }
    navbar(data) {
        $('#navbar-wrapper').html(data);
    }
    profile(data) {
        this.setHTML(data.html)
        $("#profileForm").submit(function(e){
            data = $("#profileForm").serializeArray()
            this.c.updateProfile(data);
            e.preventDefault(e);
        }.bind({c: this.c}));
    }
    server(data) {
        this.setHTML(data)
        $("#wsToggle").bootstrapToggle();
        //Hack to allow this controller without having to unbind "this"
        window.c = this.c
        $('.pluginToggle').each(function(index, element) {
            $(this).bootstrapToggle()
            $(this).change(function() {
                var controller = window.c
                controller.togglePlugin($(this).data("plugin"), $(this).prop('checked'))
              })
            if (index === (length - 1)) {
                delete window.c;
            }
        })
        $("#settingsForm").submit(function(e){
            data = $("#settingsForm").serializeArray()
            this.c.updateSettings(data);
            e.preventDefault(e);
        }.bind({c: this.c}));
    }
    login(data) {
        this.setHTML(data)
        $("#loginForm").submit(function(e){
            data = $("#loginForm").serializeArray()
            $(".notifications").toast()
            this.c.postLogin(data);
            e.preventDefault(e);
        }.bind({c: this.c}));
    }
    register(data) {
        this.setHTML(data)
        $("#registerForm").submit(function(e){
            data = $("#registerForm").serializeArray()
            this.c.postRegister(data);
            e.preventDefault(e);
        }.bind({c: this.c}));
    }
    document(data) {
        this.setHTML(data)
        var easyMDE = new EasyMDE({
            autofocus: true,
            minHeight: "900px",
            autoDownloadFontAwesome: false,
            spellChecker: false,
            Element: $('#working-document')[0]
        });
        $("#loginForm").submit(function(e){

            data = $("#loginForm").serializeArray()
            this.c.saveDocument(data);
            e.preventDefault(e);
        }.bind({c: this.c}));
        $('#tagPopover').popover({
            sanitize: false
          })
        $('#tagPopover').on('shown.bs.popover', function () {
            $("#docTag_form").submit(function(e){

                data = $("#docTag_form").serializeArray()
                this.c.addTag(data);
                e.preventDefault(e);
                $('#tagPopover').popover('hide');
            }.bind(this));
            $('#email_tag').on('input', function() {
                let email = $('#email_tag').val();
                this.c.checkEmail(email)
            }.bind(this));
            $('#tagPopover_close').click(function(event) {
                event.preventDefault();
                $('#tagPopover').popover('hide')
            })
        }.bind(this))

    }
    toggleValidEmail(valid){
        if (valid){
            $('#email_tag').removeClass('is-invalid').addClass('is-valid');
        }else{
            $('#email_tag').removeClass('is-valid').addClass('is-invalid');
        }
    }
    setHTML(data){
        if (this.c.socket.locals.user){
            this.authenticated()
        }else{
            this.unauthenticated()
        }
        $('#view').html(data);
    }

    authenticated(){
        $("#wrapper").addClass("toggled");
        $('#view').removeClass('col-4');
        $('#view').addClass('col-8');
        $("#menu-toggle").show();
        $("#menu-toggle").off('click').on('click' ,function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
          });
    }

    unauthenticated(){
        $("#wrapper").removeClass("toggled");
        $('#view').addClass('col-4');
        $('#view').removeClass('col-8');
        $("#menu-toggle").hide();
    }

    notFound(data) {
        $('#view').html("<h1>Not Found!</h1>");
    }
    
}