Meteor.subscribe('users');
Deps.autorun(function(){

  //Al pasar el usuario y no el ID, se resuscribe cada vez que se modifica el mismo
  //Posible problema de performance!!
  Meteor.subscribe('events', Meteor.user());
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

Router.map(function () {

  this.route('home', {
    path: '/',
    template: 'home'
  });

  this.route('profileEdit', {
    path: '/profile',
    template: 'profileEdit',
    before: function (){
      if(!Meteor.loggingIn() && !Meteor.user()) {
        this.redirect('home');
      }
    }
  });

  this.route('admin', {
    path: '/admin',
    template: 'eventList',
    //Incluir verificacion de permisos
    before: function (){
      if(!Meteor.loggingIn() && !Meteor.user()) {
        this.redirect('home');
      }
    }
  });

  this.route('newEvent', {
    path: '/admin/new',
    template: 'eventNew',
    //Incluir verificacion de permisos
    before: function (){
      if(!Meteor.loggingIn() && !Meteor.user()) {
        this.redirect('home');
      }
    }
  });

  this.route('newEvent', {
    path: '/admin/edit/:_id',
    template: 'eventEdit',
    //Incluir verificacion de permisos
    before: function (){
      if(!Meteor.loggingIn() && !Meteor.user()) {
        this.redirect('home');
      }
      Session.set('edit-event', this.params._id);
    }
  });

});
