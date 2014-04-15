if (Meteor.isClient) {
  Meteor.methods({
    updateBusquedaLocInit: function(bId, user, updateData){
      if(bId && updateData){
        if(isNaN(updateData.latitude)){ return false; }
        if(isNaN(updateData.longitude)){ return false; }
        if(updateData.latitude && (updateData.latitude>90 || updateData.latitude<-90)) { return false; }
        if(updateData.longitude && (updateData.longitude>180 || updateData.longitude<-180)){ return false; }

        Busquedas.update(
          { _id:bId},
          { $set: {
            'initLatitude': updateData.latitude,
            'initLongitude': updateData.longitude
          }}
        );
      }
    },

    updateBusquedaLocEnd: function(bId, user, updateData){
      if(bId && updateData){
        if(isNaN(updateData.latitude)){ return false; }
        if(isNaN(updateData.longitude)){ return false; }
        if(updateData.latitude && (updateData.latitude>90 || updateData.latitude<-90)) { return false; }
        if(updateData.longitude && (updateData.longitude>180 || updateData.longitude<-180)){ return false; }

        Busquedas.update(
          { _id:bId},
          { $set: {
            'endLatitude': updateData.latitude,
            'endLongitude': updateData.longitude
          }}
        );
      }
    },

    setActiveBusqueda: function(bId, user){
      if(bId){
        Busquedas.update({ _id: { $ne: bId.toString() }}, { $set: { active: false }}, {multi: true});
        Busquedas.update({ _id: bId.toString() }, { $set: { active: true }});
      }
    },

    unSetActiveBusqueda: function(bId, user){
      if(bId){
        Busquedas.update({ _id: bId.toString() }, { $set: { active: false }});
      }
    },

    removeBusqueda: function(bId, user){
      if(bId){
        Busquedas.remove({ _id: bId.toString() });
      }
    },

    busquedaAddNew: function(user, busquedaData){
      if(busquedaData){
        if(!busquedaData.id || busquedaData.id == ''){ return false; }
        if(!busquedaData.descripcion  || busquedaData.descripcion == '' ){ return false; }
        if(!busquedaData.begin || busquedaData.begin == '' ){ return false; }
        if(!busquedaData.end || busquedaData.end == '' ){ return false; }
        if(isNaN(busquedaData.cupoMin) || busquedaData.cupoMin == '') { return false ;}
        if(isNaN(busquedaData.cupoMax) || busquedaData.cupoMax == '') { return false ;}
        if(busquedaData.cupoMax < busquedaData.cupoMin){ return false; }

        Busquedas.insert(busquedaData);
      }
    },

    setScoreBoardBusqueda: function(bId, user, value){
      if(bId){
        Busquedas.update({ _id: bId.toString() }, { $set: { publicScoreboard: value }});
      }
    },

  });
};
