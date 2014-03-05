if (Meteor.isClient) {
  Template.homeTesoro.busquedaStarted = function () {
    return Session.get('busqueda-inProgress');
  };

  Template.homeNotStartedTesoro.greeting = function () {
    if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
      if (Meteor.user().services.facebook.gender == "male") {
        return "Bienvenido "+Meteor.user().profile.name+"!";
      } else {
        return "Bienvenida "+Meteor.user().profile.name+"!";
      }
    }
  };

  Template.homeNotStartedTesoro.busqueda = function () {
    return Busquedas.findOne({'_id': Session.get('busqueda-active')});
  };

  Template.homeNotStartedTesoro.busquedaActive = function () {
    if (Session.get('busqueda-active')) {
      return true;
    } else {
      return false;
    }
  };

  Template.homeNotStartedTesoro.hasTeam = function () {
    return false;
  };

  Template.homeNotStartedTesoro.isProfileComplete = function () {
    //Verificar que el usuario tenga sus campos obligatorios completos
    return Session.get('profile-complete');
  };

}