if (Meteor.isClient) {
  Template.homeViajes.greeting = function () {
    if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
      if (Meteor.user().services.facebook.gender == "male") {
        return "Bienvenido "+Meteor.user().profile.name+"!";
      } else {
        return "Bienvenida "+Meteor.user().profile.name+"!";
      }
    }
  };

  Template.homeViajes.destination = function () {
    //Buscar si existe un evento "activo"
    var eName = Eventos.findOne({active:true}).name;
    return eName;
  };

  Template.homeViajes.isEventSet = function () {
    //Buscar si existe un evento "activo"
    if(Session.get('event-active')){
      return true;
    } else {
      return false;
    }
  };

  Template.homeViajes.isEventOpen = function () {
    //Opera sobre el evento open
    return Session.get('event-registracion');
  };

  Template.homeViajes.isEventEnabled = function () {
    //Opera sobre el evento si esta enabled
    return Session.get('event-chismografo');
  };

  Template.homeViajes.userAttendingEvent = function () {
    //Indica si el usuario logueado asistirá al evento
    return Session.get('event-attending');
  };

  Template.homeViajes.isRoomSelected = function () {
    //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
    var results = Rooms.findOne({
      'pax': { $in: [Meteor.user()._id] },
      'eventId': Session.get('event-active')
    });

    if(results) {
      return true;
    }  
    return false;
  };

  Template.homeViajes.isBusSelected = function () {
    //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
    var results = Buses.findOne({
      'pax': { $in: [Meteor.user()._id] },
      'eventId': Session.get('event-active')
    });

    if(results) {
      return true;
    }  
    return false;
    return false;
  };

  Template.homeViajes.isProfileComplete = function () {
    //Verificar que el usuario tenga sus campos obligatorios completos
    return Session.get('profile-complete');
  };

  Template.homeViajes.picId = function () {
    if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
      return Meteor.user().services.facebook.id;
    }
  };
}