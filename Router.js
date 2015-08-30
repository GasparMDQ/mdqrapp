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
//
// var mustBeAttending = function(){
//     if(!Session.get('event-attending')){
//         this.redirect('viajesHome');
//     }
//     this.next();
// };

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

// var setEventOptions = function(){
//     //Verifica que haya un evento activo y lo setea
//     if(Eventos.find({active:true}).count() == 1){
//         var evento = Eventos.findOne({active:true});
//         Session.set('event-active', evento._id);
//         Session.set('event-registracion', evento.registracion);
//         Session.set('event-chismografo', evento.chismografo);
//
//         //Verifica que el usuario asista al evento activo
//         Meteor.call('userAttendingEvento', Session.get('event-active'), Meteor.user(), function(error,result){
//             if(!error){
//                 Session.set('event-attending', result);
//             } else {
//                 Session.set('event-attending', false);
//             }
//         });
//     } else {
//         Session.set('event-active', false);
//         Session.set('event-attending', false);
//         Session.set('event-chismografo', false);
//         Session.set('event-registracion', false);
//     }
//     this.next();
// };


//Global rules
Router.onBeforeAction(mustBeSignedIn, {except: ['home']});
Router.onBeforeAction(mustBeAdmin, {only: ['admin', 'newEvent']});

//Router.onBeforeAction(setEventOptions, {only: ['viajesHome', 'roomsList', 'busesList']});
Router.onBeforeAction(setProfileStatus, {only: ['viajesHome', 'roomsList', 'busesList']});
Router.onBeforeAction(isAbleToChoose, {only: ['roomsList', 'busesList']});
//Router.onBeforeAction(mustBeAttending, {only: ['roomsList', 'busesList']});


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
