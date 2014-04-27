var Trunc = function(string, n, useWordBoundary){
  var toLong = string.length>n,
  s_ = toLong ? string.substr(0,n-1) : string;
  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  return  toLong ? s_ + ' ...' : s_;
};

Meteor.methods({

  isTeamValid: function(teamData){
    if(teamData) {
      if(!teamData.id || teamData.id == ''){ return false; }
      //Verifico que no exista otro equipo con el mismo nombre
      var existeTeam = Equipos.find({'id': teamData.id}).count();
      if(existeTeam != 0) { return false; }
      return true;
    }
    return false;
  },

  addNewTeam: function(bId, user, tId){
    var teamData = {
      id: tId,
      pax: [user._id],
      dnf: false,
      routeId: '',
      respuestas: [],
      busquedaId: bId,
      handicap: 0,
      owner: user._id,
      pago: false,
      bonus: 0
    };

    Meteor.call('isTeamValid',teamData, function (error, result){
      if (result) {
        Meteor.call('userInTeam', bId, user._id, function (error, result){
          if(typeof result != 'undefined' && !result){
            Equipos.insert(teamData);
          } else {
            console.log('Error:addNewTeam:userInTeam: '+ error);
          }
        });
      } else {
        console.log('Error:addNewTeam:isTeamValid: not valid');
      }
    });
  },

  removeTeam: function(tId, user){
    if(tId) {
      var isOwner = Equipos.find({
        '_id' : tId,
        'owner' : user._id
      }).count() != 0;

      if (isOwner || Roles.userIsInRole(user, ['admin','super-admin'])) {
        Equipos.remove({ _id: tId.toString() });
      } else {
        console.log('Error:removeTeam: not allowed');
      }
    }
  },

  updateTeam: function(tId, user, teamData){
    if(tId && teamData){
      if(!teamData.id || teamData.id == ''){ throw new Meteor.Error(400, 'Debe indicar un nombre para el equipo'); }
      if(isNaN(teamData.handicap)){ throw new Meteor.Error(400, 'El handicap debe ser un número'); }
      if(isNaN(teamData.bonus)){ throw new Meteor.Error(400, 'El bonus debe ser un número'); }

      if(Roles.userIsInRole(user, ['admin','super-admin'])){
        Equipos.update(
          { _id:teamData._id},
          { $set: {
            'id': teamData.id,
            'handicap': teamData.handicap,
            //'routeId': teamData.route,
            'dnf': teamData.dnf,
            'bonus': teamData.bonus
          }}
        );
      } else {
        console.log('Error:updateTeam: not allowed');
      }
    } else {
      console.log('Error:updateTeam: invalid data');
    }
  },

  teamCheckIn: function(tId, user){
    //Veririco que se hayan pasado todos los parametros
    if(tId && user){
      var team = Equipos.findOne( { '_id': tId } );

      Meteor.call('userInTeam', team.busquedaId, user._id, function (error, result){
        if(typeof result != 'undefined' && !result){
          //Verifico el equipo tenga cupo disponible
          Meteor.call('teamIsAvailable',tId, function (error, result){
            if(result){
              Equipos.update( { '_id': tId }, { $addToSet: { 'pax': user._id } } );
            } else {
              console.log('Error:teamCheckIn:teamIsAvailable: '+ error);
            }
          });
        } else {
          console.log('Error:teamCheckIn:userInTeam: '+ error);
        }

      });

    } else {
      console.log('Error:teamCheckIn: faltan parametros');
    }


  },

  teamIsAvailable: function(tId){
    var team = Equipos.findOne( { '_id': tId } );
    var busqueda = Busquedas.findOne( {'_id': team.busquedaId} );
    return busqueda.cupoMax - team.pax.length > 0;
  },

  userInTeam: function(bId, userId){
    var inTeam = Equipos.find({
      'busquedaId' : bId,
      'pax' : userId
    }).count();

    if (inTeam == 0) { return false; } else { return true; };
  },

  teamCheckOut: function(tId, userId){
    if(tId && Meteor.user()._id == userId){
      var isOwner = Equipos.find({
        '_id' : tId,
        'owner' : userId
      }).count();

      if (isOwner == 0) {
        Equipos.update( { '_id': tId }, { $pull: { 'pax': Meteor.user()._id } } );
      } else {
        console.log('Error:teamCheckOut: user is owner');
      }
    }
  },

  unSetPagoTeam: function(tId, user){
    if(tId || Roles.userIsInRole(user, ['admin','super-admin'])){
      Equipos.update(
        { _id:tId},
        { $set: { 'pago': false }}
      );
    }
  },

  setPagoTeam: function(tId, user){
    if(tId || Roles.userIsInRole(user, ['admin','super-admin'])){
      Equipos.update(
        { _id:tId},
        { $set: { 'pago': true }}
      );
    }
  },

  setFinishTeam: function(tId, user){
    if(tId || Roles.userIsInRole(user, ['admin','super-admin'])){
      Equipos.update(
        { _id:tId},
        { $set: { 'routeEnd': new Date().getTime() }}
      );
    }
  },

  teamSetRoute: function(tId, user, routeData){
    if(tId){
      var equipo = Equipos.findOne({
        '_id' : tId,
        'pax' : user._id
      });

      var ruta = Routes.findOne({
        'id': routeData.id,
        'busquedaId': routeData.busquedaId
      });

      if (typeof equipo != 'undefined'){
        if(equipo.routeId){
          throw new Meteor.Error(403,'Ya tiene ruta asignada');
        }
        if(typeof ruta != 'undefined'){
          Equipos.update(
            { _id:tId},
            { $set: {
              'routeId': ruta._id,
              'routeBegin': new Date().getTime(),
            }}
          );
        } else {
          throw new Meteor.Error(404,'No existe la ruta '+routeData.id);
        }
      } else {
        throw new Meteor.Error(403,'Error de validación de usuario');
      }
    }
  },

    teamAddAnswer: function(tId, user, answerData){
      /*
        Verificar:
        - Que los datos vengan completos y sean validos
        - Que el usuario pertenezca al equipo
        - Que la pregunta pertenezca a la ruta del equipo
        - Que no exista una respuesta para la misma pregunta
        - Que la hora de respuesta no sea mayor a la de finalización del juego
        - Que la hora de respuesta no sea inferior a la de comienzo del juego (opcional)
      */
      if(typeof answerData == 'undefined') { throw new Meteor.Error(42,'Error'); }

      /*
        Marco la hora de respuesta del servidor
      */
      answerData.timeStamp = new Date().getTime();

      if(answerData.id == '') { throw new Meteor.Error(42,'Id Missing'); }
      if(isNaN(answerData.respuesta)) { throw new Meteor.Error(0,'La respuesta debe ser un número'); }
      if(answerData.user != user._id) { throw new Meteor.Error(500,'User Error'); }
      if(tId == '') { throw new Meteor.Error(42,'tId Error'); }

      var inTeam = Equipos.find({'_id' : tId,'pax' : answerData.user }).count();
      if(inTeam == 0) { throw new Meteor.Error(0,'El usuario no pertenece al equipo'); }

      var equipo = Equipos.findOne({'_id' : tId });
      var rutaId = equipo.routeId;

      var inRoute = Routes.find({'_id' : rutaId,'nodos' : answerData.id }).count();
      if(inRoute == 0) { throw new Meteor.Error(0,'La pregunta no pertenece a la ruta'); }

      var idNodos = [];
      for (var i=0; i<equipo.respuestas.length; i++) {
        idNodos.push(equipo.respuestas[i].id);
      }
      var hasRespuesta = idNodos.indexOf(answerData.id) != -1;
      if(hasRespuesta) { throw new Meteor.Error(0,'La pregunta ya fue respondida por el equipo'); }

      var busqueda = Busquedas.findOne({'_id': equipo.busquedaId });
      var horaRespuesta = moment(answerData.timeStamp);
      var horaInicio = moment(busqueda.begin, 'YYYY-MM-DDTHH:mm');
      var horaFin = moment(busqueda.end, 'YYYY-MM-DDTHH:mm');


      if(horaRespuesta.isAfter(horaFin)) { throw new Meteor.Error(403,'Búsqueda finalizada. No se pueden agregar respuestas.'); }
      if(horaRespuesta.isBefore(horaInicio)) { throw new Meteor.Error(403,'La búsqueda aun no comenzó. No se pueden agregar respuestas.'); }

      //Si no generó ningun error, agrego las respuestas al set
      Equipos.update( { '_id': tId }, { $addToSet: { 'respuestas': answerData } } );
  
    },


});
