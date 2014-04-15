Meteor.subscribe('userData');
Meteor.subscribe('allUsersData');

Deps.autorun(function(){

  //Al pasar el usuario y no el ID, se resuscribe cada vez que se modifica el mismo
  //Posible problema de performance!!
  Meteor.subscribe('events', Meteor.user());
});
Deps.autorun(function(){
  Meteor.subscribe('nodosAndRoutes', Meteor.user(), Session.get('busqueda'));
});
Deps.autorun(function(){
  Meteor.subscribe('busquedas', Meteor.user());
});
Deps.autorun(function(){
  Meteor.subscribe('teams', Session.get('busqueda-active'), Meteor.user());
});
Deps.autorun(function(){
  Meteor.subscribe('roomsAndBuses', Session.get('event-active'), Meteor.user());
});

Meteor.methods({});

if (Meteor.isClient) {
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

// Routing data
Router.configure({
  layoutTemplate: 'layout'
});

var mustBeSignedIn = function(){
  if(!Meteor.loggingIn() && !Meteor.user()) {
    this.redirect('home');
  }
};

var mustBeOpen = function(){
  if(!Session.get('event-registracion')){
    this.redirect('viajesHome'); 
  }
};

var mustBeAttending = function(){
  if(!Session.get('event-attending')){
    this.redirect('viajesHome'); 
  }
};

var mustBeAQuest = function(){
  if(!Session.get('busqueda-active')){
    this.redirect('tesoroHome'); 
  }
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
};

var setEventOptions = function(){
  //Verifica que haya un evento activo y lo setea
  if(Eventos.find({active:true}).count() == 1){
  var evento = Eventos.findOne({active:true});
    Session.set('event-active', evento._id);
    Session.set('event-registracion', evento.registracion);
    Session.set('event-chismografo', evento.chismografo);

    //Verifica que el usuario asista al evento activo
    Meteor.call('userAttendingEvento', Session.get('event-active'), Meteor.user(), function(error,result){
      if(!error){
        Session.set('event-attending', result);
      } else {
        Session.set('event-attending', false);
      }
    });
  } else {
    Session.set('event-active', false);
    Session.set('event-attending', false);
    Session.set('event-chismografo', false);
    Session.set('event-registracion', false);
  }
};

var setBusquedaOptions = function(){
  //Verifica que haya un evento activo y lo setea
  if(Busquedas.find({active:true}).count() == 1){
  var busqueda = Busquedas.findOne({active:true});
    Session.set('busqueda', busqueda);
    Session.set('busqueda-active', busqueda._id);
    Session.set('busqueda-inProgress', busqueda.live);
  } else {
    Session.set('busqueda-active', false);
    Session.set('busqueda-inProgress', false);
  }
};

//Global rules
Router.onBeforeAction(mustBeSignedIn, {except: ['home']});
Router.onBeforeAction(setEventOptions, {only: ['viajesHome', 'roomsList', 'busesList']});
Router.onBeforeAction(setBusquedaOptions, {only: ['tesoroHome', 'teamList', 'tesoroTeamHistory']});
Router.onBeforeAction(setProfileStatus, {only: ['viajesHome', 'tesoroHome', 'roomsList', 'busesList']});
Router.onBeforeAction(mustBeOpen, {only: ['roomsList', 'busesList']});
Router.onBeforeAction(mustBeAttending, {only: ['roomsList', 'busesList']});
Router.onBeforeAction(mustBeAQuest, {only: ['teamList', 'tesoroTeamHistory']});

Router.map(function () {

  this.route('home', {
    path: '/',
    template: 'home',
  });

  this.route('tesoroHome', {
    path: '/tesoro',
    template: 'homeTesoro',
  });  

  this.route('viajesHome', {
    path: '/viaje',
    template: 'homeViajes',
  });  

  this.route('profileEdit', {
    path: '/profile',
    template: 'profileEdit',
  });

  this.route('roomsList', {
    path: '/habitaciones',
    template: 'roomsList',
  });

  this.route('busesList', {
    path: '/micros',
    template: 'busesList',
  });

  this.route('admin', {
    path: '/admin',
    template: 'eventList',
    //Incluir verificacion de permisos
  });

  this.route('newEvent', {
    path: '/admin/new',
    template: 'eventNew',
    //Incluir verificacion de permisos
  });

  this.route('editEvent', {
    path: '/admin/edit/:_id',
    template: 'eventEdit',
    //Incluir verificacion de permisos
    onBeforeAction: function (){
      Session.set('edit-event', this.params._id);
    }
  });

  this.route('busquedaList', {
    path: '/admin/tesoro',
    template: 'busquedaAdminHome',
    //Incluir verificacion de permisos
  });


  this.route('editBusqueda', {
    path: '/admin/tesoro/:_id',
    template: 'busquedaEdit',
    //Incluir verificacion de permisos
    onBeforeAction: function (){
      Session.set('edit-busqueda', this.params._id);
    }
  });

  this.route('teamList', {
    path: '/tesoro/equipos',
    template: 'teamList',
  });  

  this.route('tesoroTeamHistory', {
    path: '/tesoro/respuestas',
    template: 'tesoroTeamHistory',
  });  

});
