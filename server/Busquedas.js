Meteor.methods({
  isBusquedaValid: function(busquedaData){
    if(busquedaData) {
      if(!busquedaData.id || busquedaData.id == ''){ return false; }
      if(!busquedaData.descripcion  || busquedaData.descripcion == '' ){ return false; }
      if(!busquedaData.date || busquedaData.date == '' ){ return false; }
      if(isNaN(busquedaData.cupoMin) || busquedaData.cupoMin == '') { return false ;}
      if(isNaN(busquedaData.cupoMax) || busquedaData.cupoMax == '') { return false ;}
      if(busquedaData.cupoMax < busquedaData.cupoMin){ return false; }
      
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

  setScoreBoardBusqueda: function(bId, user, value){
    if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
      Busquedas.update({ _id: bId.toString() }, { $set: { publicScoreboard: value }});
      return true;
    } else {
      console.log('Error:unSetScoreBoardBusqueda: not allowed');
    }
  },

  setActiveBusqueda: function(bId, user){
    //Verifico que tenga los permisos necesarios para activar eventos
    if(Roles.userIsInRole(user, ['super-admin', 'admin']) && bId){
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
      console.log('Error:unSetActiveBusqueda: not allowed');
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

  updateBusquedaInit: function(bId, user, updateData){
    if(bId && updateData){
      if(isNaN(updateData.latitude)){ throw new Meteor.Error(400, 'Debe indicar la latitud de inicio'); }
      if(isNaN(updateData.longitude)){ throw new Meteor.Error(400, 'Debe indicar la longitud de inicio');  }
      if(updateData.latitude && (updateData.latitude>90 || updateData.latitude<-90)) { throw new Meteor.Error(400, 'La latitud debe ser entre 90 y -90');  }
      if(updateData.longitude && (updateData.longitude>180 || updateData.longitude<-180)){ throw new Meteor.Error(400, 'La latitud debe ser entre 180 y -180'); }

      if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
        Busquedas.update(
          { _id:bId},
          { $set: {
            'initLatitude': updateData.latitude,
            'initLongitude': updateData.longitude
          }}
        );
      }
    }
  },

  updateBusquedaEnd: function(bId, user, updateData){
    if(bId && updateData){
      if(isNaN(updateData.latitude)){ throw new Meteor.Error(400, 'Debe indicar la latitud de fin'); }
      if(isNaN(updateData.longitude)){ throw new Meteor.Error(400, 'Debe indicar la longitud de fin');  }
      if(updateData.latitude && (updateData.latitude>90 || updateData.latitude<-90)) { throw new Meteor.Error(400, 'La latitud debe ser entre 90 y -90');  }
      if(updateData.longitude && (updateData.longitude>180 || updateData.longitude<-180)){ throw new Meteor.Error(400, 'La latitud debe ser entre 180 y -180'); }

      if(Roles.userIsInRole(user, ['super-admin', 'admin'])){
        Busquedas.update(
          { _id:bId},
          { $set: {
            'endLatitude': updateData.latitude,
            'endLongitude': updateData.longitude
          }}
        );
      }
    }
  },



});
