
Meteor.methods({
  isRoomValid: function(roomData){
    if(roomData) {
      if(!roomData.id || roomData.id == ''){ return false; }
      if(!roomData.descripcion  || roomData.descripcion == '' ){ return false; }
      if(!roomData.cupo || roomData.cupo == '' ){ return false; }
      if(roomData.cupo < 0) { return false; }
      return true;
    }
    return false;
  },

  roomAddNew: function(eId, user, roomData){
    Meteor.call('isRoomValid',roomData, function (error, result){
      if (result) {
        Meteor.call('userHasEvento',eId, user, function (error, result){

          //Verifico que tenga los permisos necesarios para agregar eventos
          if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
            Rooms.insert(roomData);
          } else {
            if(error){
              console.log('Error:userHasEvento: ' + error);
            } else {
              console.log('Error:roomAddNew: not allowed');
            }

          }
        });
      }
    });
  },

  updateRoom: function(rId, user, roomData){
    Meteor.call('isRoomValid',roomData, function (error, result){
      if (result) {
        Meteor.call('userHasEvento',roomData.eventId, user, function (error, result){
          //Verifico que tenga los permisos necesarios para agregar eventos
          if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
            Rooms.update(
              { _id:roomData._id},
              { $set: {
                'id': roomData.id,
                'descripcion': roomData.descripcion,
                'cupo': roomData.cupo
              }}
            );
          } else {
            if(error){
              console.log('Error:userHasEvento: ' + error);
            } else {
              console.log('Error:updateRoom: not allowed');
            }

          }
        });
      }
    });
  },

  removeRoom: function(rId, eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){
      //Verifico que tenga los permisos necesarios para editar el eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Rooms.remove({ _id: rId.toString() });
      } else {
        console.log('Error:removeRoom: ' + error);
      }
    });
  },

  roomCheckIn: function(rId, user, eId){
    //Veririco que se hayan pasado todos los parametros
    if(rId && user && eId){
      //Verifico que el usuario tenga el evento
      Meteor.call('userHasEvento',eId, user, function (error, result){
        if(result){
          //Verifico que el usuario no este en otra habitacion del mismo evento
          Meteor.call('userHasRoom',eId, user, function (error, result){
            //Verifico !result ya que necesito es necsario que NO tenga ya habitacion
            if(typeof result != 'undefined' && !result){
              //Verifico la habitacion tenga espacio disponible
              Meteor.call('roomIsAvailable',rId, function (error, result){
                if(result){
                  Rooms.update( { '_id': rId }, { $addToSet: { 'pax': user._id } } );
                } else {
                  console.log('Error:roomCheckIn:roomIsAvailable: '+ error);
                }
              });
            } else {
              console.log('Error:roomCheckIn:userHasRoom: '+ error);
            }
          });

        } else {
          console.log('Error:roomCheckIn:userHasEvento: '+ error);
        }
      });
    } else {
      console.log('Error:roomCheckIn: faltan parametros');
    }
  },

  roomCheckOut: function(rId, userId, eId){
    if(Meteor.user()._id == userId) {
      Meteor.call('userHasEvento',eId, Meteor.user(), function (error, result){
        //Verifico que tenga los permisos necesarios para realizar el checkOut el eventos
        if(result && rId){
          Rooms.update( { '_id': rId }, { $pull: { 'pax': Meteor.user()._id } } );
        } else {
          console.log('Error:roomCheckOut: ' + error);
        }
      });
    }
  },

  roomIsAvailable: function(rId){
    var room = Rooms.findOne( { '_id': rId } );
    return room.cupo - room.pax.length > 0;
  },

});
