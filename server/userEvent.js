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

        //El evento que se gestiona en el sitio
        evento.active = false;
        
        //Evento disponible para registrarse
        evento.open = false;
        
        //Funcionalidades del evento activas (chismografo, etc)
        evento.enabled = false;

        //Lista de micros y habitaciones vacias
        evento.micros = [];
        evento.habitaciones = [];

        if (evento.description){
          evento.shortDescripcion = Trunc(evento.description,200,true);
        }

        //Se usa update con {upsert:true} para evitar errores por claves duplicadas en caso de multiples clicks
        Eventos.update({ _id:evento._id}, evento, {upsert:true});
      } else {
        if(error){
          console.log('Error:userHasEvento: ' + error);
        } else {
          console.log('Error:addNewEvent: not allowed');
        }

      }
    });
  },

  setActiveEvent: function(eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){
      //Verifico que tenga los permisos necesarios para activar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Eventos.update({ _id: { $ne: eId.toString() }}, { $set: { active: false }}, {multi: true});
        Eventos.update({ _id: eId.toString() }, { $set: { active: true }});
      } else {
        console.log('Error:setActiveEvent: ' + error);
      }
    });
  },

  setUnActiveEvent: function(eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){
      //Verifico que tenga los permisos necesarios para desactivar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Eventos.update({ _id: eId.toString() }, { $set: { active: false }});
      } else {
        console.log('Error:setUnActiveEvent: ' + error);
      }
    });
  },

  removeEvent: function(eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){
      //Verifico que tenga los permisos necesarios para borrar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Eventos.remove({ _id: eId.toString() });
      } else {
        console.log('Error:removeEvent: ' + error);
      }
    });
  }

});
