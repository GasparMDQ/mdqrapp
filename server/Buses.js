
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


});
