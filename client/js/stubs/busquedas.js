if (Meteor.isClient) {
  Meteor.methods({
    updateBusquedaInit: function(bId, user, updateData){
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

    updateBusquedaEnd: function(bId, user, updateData){
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

  });
};
