var Trunc = function(string, n, useWordBoundary){
  var toLong = string.length>n,
  s_ = toLong ? string.substr(0,n-1) : string;
  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  return  toLong ? s_ + ' ...' : s_;
};

Meteor.methods({
  refreshUserAttendingEvents: function(user){
    var results = Meteor.call('getUserAttendingEvents');
    var data = new Object(null);
    var addData = false;

    Meteor.users.update({_id:user._id}, {$set: {"eventos": []}}, {upsert: true});

    for (var i = 0; i < results.data.length; i++) {
      if(user.services.facebook.id == results.data[i].owner.id) {
        addData = true;
      } else {
        for (var j = 0; j < results.data[i].admins.data.length; j++) {
          if(user.services.facebook.id == results.data[i].admins.data[j].id) {
            addData = true;
          }
        };
      }

      if(addData){
        data._id = results.data[i].id;
        data.name = results.data[i].name;
        data.startTime = results.data[i].start_time;
        Meteor.users.update({_id:user._id}, {$addToSet: {"eventos": data}});
        addData=false;
      }
    };
  },

  addNewEvent: function(eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){

      //Verifico que tenga los permisos necesarios para agregar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        var evento = Meteor.call('getEventInfo', eId);

        //Se utiliza el ID del evento como _ID para la DB
        evento._id = evento.id;
        evento.active = false; //El evento que se gestiona en el sitio
        evento.open = false; //Evento disponible para registrarse
        evento.enabled = false; //Funcionalidades del evento activas (chismografo, etc)
        if (evento.description){
          evento.shortDescripcion = Trunc(evento.description,200,true);
        }
        Eventos.insert(evento);
      } else {
        console.log(error);
      }
    });
  }
});
