if (Meteor.isClient) {
  Template.home.userLogged = function () {
    return Meteor.user();
  };

  Template.homeLogged.greeting = function () {
    if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
      if (Meteor.user().services.facebook.gender == "male") {
        return "Bienvenido "+Meteor.user().profile.name+"!";
      } else {
        return "Bienvenida "+Meteor.user().profile.name+"!";
      }
    }
  };

  Template.homeLogged.destination = function () {
    //Buscar si existe un evento "activo"
    var eName = Eventos.findOne({active:true}).name;
    return eName;
  };

  Template.homeLogged.isEventSet = function () {
    //Buscar si existe un evento "activo"
    if(Session.get('event-active')){
      return true;
    } else {
      return false;
    }
  };

  Template.homeLogged.isEventOpen = function () {
    //Opera sobre el evento open
    var evento = Eventos.findOne({_id:Session.get('event-active')});
    if(evento){
      return evento.registracion;
    } else {
      return false;
    }
  };

  Template.homeLogged.isEventEnabled = function () {
    //Opera sobr el evento si esta enabled
    var evento = Eventos.findOne({_id:Session.get('event-active')});
    if(evento){
      return evento.chismografo;
    } else {
      return false;
    }
  };

  Template.homeLogged.userAttendingEvent = function () {
    //Indica si el usuario logueado asistirá al evento
    Meteor.call('userAttendingEvento', Session.get('event-active'), Meteor.user(), function(error,result){
      if(!error){
        Session.set('event-attending', result);
      } else {
        Session.set('event-attending', false);
      }
    });
    return Session.get('event-attending');
  };

  Template.homeLogged.isRoomSelected = function () {
    //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
    return false;
  };

  Template.homeLogged.isBusSelected = function () {
    //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
    return false;
  };

  Template.homeLogged.isProfileComplete = function () {
    //Verificar que el usuario tenga sus campos obligatorios completos
    Meteor.call('hasProfileComplete', Meteor.user(), function(error,result){
      if(!error){
        Session.set('profile-complete', result);
      } else {
        Session.set('profile-complete', false);
      }
    });
    return Session.get('profile-complete');
  };

  Template.homeLogged.picId = function () {
    if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
      return Meteor.user().services.facebook.id;
    }
  };
}