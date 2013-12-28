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

  Template.homeLogged.isEventSet = function () {
    //Buscar si existe un evento "activo"
    return true;
  };

  Template.homeLogged.isEventOpen = function () {
    //Opera sobr el evento open
    return true;
  };

  Template.homeLogged.isEventEnabled = function () {
    //Opera sobr el evento si esta enabled
    return false;
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