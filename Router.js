// Routing data
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loader'
});

var mustBeSignedIn = function(){
    if(!Meteor.loggingIn() && !Meteor.user()) {
        this.redirect('home');
    }
    this.next();
};

var mustBeAdmin = function(){
    if (!Roles.userIsInRole(Meteor.user(), ['admin','super-admin'])){
        this.redirect('home');
    }
    this.next();
};

var isAbleToChoose = function(){
    if ( Eventos.find({active:true}).count() !== 1 || true !== Meteor.user().pago || !Eventos.findOne({active:true}).registracion ) {
        this.redirect('viajesHome');
    }
    this.next();
};

var setProfileStatus = function(){
    //Verifica el estado del perfil
    Meteor.call('hasProfileComplete', Meteor.user(), function(error,result){
        if(!error){
            Session.set('profile-complete', result);
        } else {
            Session.set('profile-complete', false);
        }
    });
    this.next();
};

//Global rules
Router.onBeforeAction(mustBeSignedIn, {except: ['home']});
Router.onBeforeAction(mustBeAdmin, {only: ['admin', 'newEvent']});

Router.onBeforeAction(setProfileStatus, {only: ['viajesHome', 'roomsList', 'busesList']});
Router.onBeforeAction(isAbleToChoose, {only: ['roomsList', 'busesList']});

Router.route('/', function () {
        this.render('home', {});
    },
    { name: 'home' }
);

Router.route('/viaje', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            Session.set('event-active', Eventos.find({active:true}).count() == 1);
            this.render('homeViajes', {
                data: function () {
                    return Eventos.findOne({active:true});
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'viajesHome'
});

Router.route('/profileEdit', function (){
        this.render('profileEdit', {});
    },
    { name: 'profileEdit' }
);

Router.route('/informacion', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            Session.set('event-active', Eventos.find({active:true}).count() == 1);
            this.render('eventInfo', {
                data: function () {
                    return Eventos.findOne({active:true});
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'eventInfo'
});

Router.route('/habitaciones', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            Session.set('event-active', Eventos.find({active:true}).count() == 1);
            Session.set('event-id', Eventos.findOne({active:true})._id);
            this.render('roomsList', {
                data: function () {
                    return Eventos.findOne({active:true});
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'roomsList'
});

Router.route('/micros', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            Session.set('event-active', Eventos.find({active:true}).count() == 1);
            Session.set('event-id', Eventos.findOne({active:true})._id);
            this.render('busesList', {
                data: function () {
                    return Eventos.findOne({active:true});
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'busesList'
});

Router.route('/eventos', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            this.render('eventList', {
                data: function () {
                    return Eventos.find();
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'admin'
});


Router.route('/eventos/new', function(){
        this.render('eventNew');
    },
    { name: 'newEvent' }
);

Router.route('/eventos/edit/:_id', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            Session.set('edit-event', this.params._id);
            this.render('eventForm', {
                data: function () {
                    return Eventos.findOne({_id: this.params._id});
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'editEvent'
});

Router.route('/eventos/edit/:_id/report', {
    waitOn: function () {
        return Meteor.subscribe('events', Meteor.user());
    },
    action: function () {
        if (this.ready()) {
            Session.set('edit-event', this.params._id);
            this.render('eventReport', {
                data: function () {
                    return Eventos.findOne({_id: this.params._id});
                }
            });
        } else {
            this.render('Loading');
        }
    },
    name: 'eventReport'
});


Router.route('/eventos/agenda', {
    action: function () {
        if (this.ready()) {
            this.render('agenda', {});
        } else {
            this.render('Loading');
        }
    },
    name: 'agenda'
});
/*
Router.map(function () {

this.route('editEvent', {
path: '/admin/edit/:_id',
template: 'eventEdit',
//Incluir verificacion de permisos
onBeforeAction: function (){
Session.set('edit-event', this.params._id);
}
});

this.route('reportEvent', {
path: '/admin/edit/report/:_id',
template: 'eventReport',
//Incluir verificacion de permisos
onBeforeAction: function (){
Session.set('edit-event', this.params._id);
}
});

});
*/
