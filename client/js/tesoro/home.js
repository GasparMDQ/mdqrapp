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
    return userHasTeam();
  };


  Template.homeNotStartedTesoro.isProfileComplete = function () {
    //Verificar que el usuario tenga sus campos obligatorios completos
    return Session.get('profile-complete');
  };

  Template.homeStarted.hasAlertas = function () {
    if(!userHasTeam()) { return true };
    if(!teamPago()) { return true };
    if(!teamReachQuota()) { return true };
    if(teamDNF()) { return true };
    return false;
  };

  Template.homeStarted.alertas = function () {
    var data=[];
    if(!userHasTeam()) { data.push('No estás inscripto en ningún equipo.'); };
    if(userHasTeam() && !teamPago()) { data.push('Tu equipo no pagó la inscripción.'); };
    if(userHasTeam() && !teamReachQuota()) { data.push('El equipo en el que estás inscripto no alcanzó la cantidad de jugadores mínimos requeridos.'); };
    if(userHasTeam() && teamDNF()) { data.push('El equipo está descalificado.'); };
    return data;
  };

  var teamDNF = function (){
    if(Meteor.user() && userHasTeam()){
      var equipo = Equipos.findOne({
        'busquedaId' : Session.get('busqueda-active'),
        'pax' : Meteor.user()._id
      });
      return equipo.dnf;
    }
    return false;
  };

  var teamPago = function (){
    if(Meteor.user() && userHasTeam()){
      var equipo = Equipos.findOne({
        'busquedaId' : Session.get('busqueda-active'),
        'pax' : Meteor.user()._id
      });
      return equipo.pago;
    }
    return false;
  };
  
  var teamReachQuota = function (){
    if(Meteor.user() && userHasTeam()){
      var equipo = Equipos.findOne({
        'busquedaId' : Session.get('busqueda-active'),
        'pax' : Meteor.user()._id
      });
      var busqueda = Session.get('busqueda');
      return equipo.pax.length>=busqueda.cupoMin && equipo.pax.length<=busqueda.cupoMax;
    }
    return false;
  };

  var userHasTeam = function () {
    if(Meteor.user()){
      var isMember = Equipos.find({
        'busquedaId' : Session.get('busqueda-active'),
        'pax' : Meteor.user()._id
      }).count();
      if (isMember != 0) { return true; }
    }
    return false;
  };
  
}