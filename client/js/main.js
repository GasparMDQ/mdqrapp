Meteor.subscribe('users');
Deps.autorun(function(){

  //Al pasar el usuario y no el ID, se resuscribe cada vez que se modifica el mismo
  //Posible problema de performance!!
  Meteor.subscribe('events', Meteor.user());
});
Deps.autorun(function(){
  Meteor.subscribe('rooms', Session.get('event-active'), Meteor.user());
});
Deps.autorun(function(){
  Meteor.subscribe('buses', Session.get('event-active'), Meteor.user());
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
    template: 'home',
    before: function(){
      //Verifica el estado del perfil
      Meteor.call('hasProfileComplete', Meteor.user(), function(error,result){
        if(!error){
          Session.set('profile-complete', result);
        } else {
          Session.set('profile-complete', false);
        }
      });

      //Verifica que haya un evento activo y lo setea
      if(Eventos.find({active:true}).count() == 1){
        var eId = Eventos.findOne({active:true})._id;
        Session.set('event-active', eId);

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
      }
    }
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

  this.route('editEvent', {
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
