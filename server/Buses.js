Meteor.methods({
  isBusValid: function(busData){
    if(busData) {
      if(!busData.id || busData.id == ''){ return false; }
      if(!busData.descripcion  || busData.descripcion == '' ){ return false; }
      if(!busData.cupo || busData.cupo == '' ){ return false; }
      if(busData.cupo < 0) { return false; }
      return true;
    }
    return false;
  },

  busAddNew: function(eId, user, busData){
    Meteor.call('isBusValid',busData, function (error, result){
      if (result) {
        Meteor.call('userHasEvento',eId, user, function (error, result){

          //Verifico que tenga los permisos necesarios para agregar eventos
          if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
            Buses.insert(busData);
          } else {
            if(error){
              console.log('Error:userHasEvento: ' + error);
            } else {
              console.log('Error:busAddNew: not allowed');
            }

          }
        });
      }
    });
  },

  updateBus: function(rId, user, busData){
    Meteor.call('isBusValid',busData, function (error, result){
      if (result) {
        Meteor.call('userHasEvento',busData.eventId, user, function (error, result){

          //Verifico que tenga los permisos necesarios para agregar eventos
          if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
            Buses.update({ _id:busData._id}, busData);;
          } else {
            if(error){
              console.log('Error:userHasEvento: ' + error);
            } else {
              console.log('Error:updateBus: not allowed');
            }

          }
        });
      }
    });
  },

  removeBus: function(rId, eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){
      //Verifico que tenga los permisos necesarios para editar el eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Buses.remove({ _id: rId.toString() });
      } else {
        console.log('Error:removeBus: ' + error);
      }
    });
  },


  busCheckIn: function(bId, user, eId){
    //Veririco que se hayan pasado todos los parametros
    if(bId && user && eId){
      //Verifico que el usuario tenga el evento
      Meteor.call('userAttendingEvento',eId, user, function (error, result){
        if(result){
          //Verifico que el usuario no este en otro micro del mismo evento
          Meteor.call('userHasBus',eId, user, function (error, result){
            //Verifico !result ya que necesito es necsario que NO tenga ya un micro
            if(typeof result != 'undefined' && !result){
              //Verifico el habitacion tenga espacio disponible
              Meteor.call('busIsAvailable',bId, function (error, result){
                if(result){
                  Buses.update( { '_id': bId }, { $addToSet: { 'pax': user._id } } );
                } else {
                  console.log('Error:busCheckIn:busIsAvailable: '+ error);
                }
              });
            } else {
              console.log('Error:busCheckIn:userHasBus: '+ error);
            }
          });

        } else {
          console.log('Error:busCheckIn:userAttendingEvento: '+ error);
        }
      });
    } else {
      console.log('Error:busCheckIn: faltan parametros');
    }
  },

  busCheckOut: function(bId, userId, eId){
    if(Meteor.user()._id == userId) {
      Meteor.call('userAttendingEvento',eId, Meteor.user(), function (error, result){
        //Verifico que tenga los permisos necesarios para realizar el checkOut el eventos
        if(result && bId){
          Buses.update( { '_id': bId }, { $pull: { 'pax': Meteor.user()._id } } );
        } else {
          console.log('Error:busCheckOut: ' + error);
        }
      });
    }
  },

  busIsAvailable: function(bId){
    var bus = Buses.findOne( { '_id': bId } );
    return bus.cupo - bus.pax.length > 0;
  },


});
