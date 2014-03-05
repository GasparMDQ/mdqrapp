
Meteor.methods({
  isBusquedaValid: function(busquedaData){
    if(busquedaData) {
      if(!busquedaData.id || busquedaData.id == ''){ return false; }
      if(!busquedaData.descripcion  || busquedaData.descripcion == '' ){ return false; }
      if(!busquedaData.date || busquedaData.date == '' ){ return false; }
      return true;
    }
    return false;
  },

  busquedaAddNew: function(user, busquedaData){
    Meteor.call('isBusquedaValid',busquedaData, function (error, result){
      //Verifico que tenga los permisos necesarios para agregar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Busquedas.insert(busquedaData);
      } else {
        if(error){
          console.log('Error:isBusquedaValid: ' + error);
        } else {
          console.log('Error:busquedaAddNew: not allowed');
        }

      }
    });
  },

  updateBusqueda: function(bId, user, busquedaData){
    Meteor.call('isBusquedaValid',busquedaData, function (error, result){
      //Verifico que tenga los permisos necesarios para agregar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        Busquedas.update(
          { _id:busquedaData._id},
          { $set: {
            'id': busquedaData.id,
            'descripcion': busquedaData.descripcion,
            'date': busquedaData.date
          }}
        );
      } else {
        if(error){
          console.log('Error:userHasEvento: ' + error);
        } else {
          console.log('Error:updateBusqueda: not allowed');
        }

      }
    });
  },

  removeBusqueda: function(bId, user){
    //Verifico que tenga los permisos necesarios para editar el eventos
    if(Roles.userIsInRole(user, ['admin','super-admin'])){
      Busquedas.remove({ _id: bId.toString() });
    } else {
      console.log('Error:removeBusqueda: not allowed');
    }
  },

  setActiveBusqueda: function(bId, user){
    //Verifico que tenga los permisos necesarios para activar eventos
    if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
      Busquedas.update({ _id: { $ne: bId.toString() }}, { $set: { active: false }}, {multi: true});
      Busquedas.update({ _id: bId.toString() }, { $set: { active: true }});
      return true;
    } else {
      console.log('Error:setActiveBusqueda: not allowed');
    }
  },

  unSetActiveBusqueda: function(bId, user){
    if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
      Meteor.call('unSetLiveBusqueda', bId, user, function (error, result){
        if(result){
          Busquedas.update({ _id: bId.toString() }, { $set: { active: false }});
        } else {
          console.log('Error:unSetLiveBusqueda: ' + error);
        }
      });
    } else {
      console.log('Error:setLiveBusqueda: not allowed');
    }
  },

  setLiveBusqueda: function(bId, user){
    //Verifico que tenga los permisos necesarios para activar eventos
    if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
      Meteor.call('setActiveBusqueda', bId, user, function (error, result){
        if(result){
          Busquedas.update({ _id: { $ne: bId.toString() }}, { $set: { live: false }}, {multi: true});
          Busquedas.update({ _id: bId.toString() }, { $set: { live: true }});
        } else {
          console.log('Error:setActiveBusqueda: ' + error);
        }
      });
    } else {
      console.log('Error:setLiveBusqueda: not allowed');
    }
  },

  unSetLiveBusqueda: function(bId, user){
    //Verifico que tenga los permisos necesarios para desactivar eventos
    if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
      Busquedas.update({ _id: bId.toString() }, { $set: { live: false }});
      return true;
    } else {
      console.log('Error:unSetLiveBusqueda: not allowed');
    }
  },


});
