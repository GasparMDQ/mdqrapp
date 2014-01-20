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
    return Session.get('event-registracion');
  };

  Template.homeLogged.isEventEnabled = function () {
    //Opera sobre el evento si esta enabled
    return Session.get('event-chismografo');
  };

  Template.homeLogged.userAttendingEvent = function () {
    //Indica si el usuario logueado asistirá al evento
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
    return Session.get('profile-complete');
  };

  Template.homeLogged.picId = function () {
    if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
      return Meteor.user().services.facebook.id;
    }
  };
}