if (Meteor.isClient) {
  Template.eventList.userLogged = function () {
    return Meteor.user();
  };

  Template.eventList.eventos = function () {
    var eventosUsuario = function(usr){
      var data = [];
      for(var i=0;i<usr.eventos.length; i++){
        data.push(usr.eventos[i]._id);
      }
      return data;
    };
    
    if (Meteor.user() && Meteor.user().eventos){
      return Eventos.find({
        _id: { $in: eventosUsuario(Meteor.user()) }
      }).fetch();
    }
  };
}