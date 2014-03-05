var Trunc = function(string, n, useWordBoundary){
  var toLong = string.length>n,
  s_ = toLong ? string.substr(0,n-1) : string;
  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  return  toLong ? s_ + ' ...' : s_;
};

Meteor.methods({

  addNewTeam: function(tId, user){
    Meteor.call('userHasTeam',tId, user, function (error, result){

      //Verifico que tenga los permisos necesarios para agregar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        var evento = Meteor.call('getEventInfo', tId);

        //Se utiliza el ID del evento como _ID para la DB
        evento._id = evento.id;

        //El evento que se gestiona en el sitio
        evento.active = false;
        
        //Evento disponible para registrarse
        evento.registracion = false;
        
        //Funcionalidades del evento activas (chismografo, etc)
        evento.chismografo = false;

        //Lista de chismes, micros y habitaciones vacias
        evento.micros = [];
        evento.habitaciones = [];
        evento.chismes = [];

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

  removeTeam: function(tId, user){
  },

  updateTeam: function(tId, user){
  },
});
