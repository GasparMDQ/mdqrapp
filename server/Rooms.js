
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
            Rooms.update({ _id:roomData._id}, roomData);;
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


});
