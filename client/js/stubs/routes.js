if (Meteor.isClient) {
  Meteor.methods({
    routeAddNew: function(bId, user, routeData){
      if(bId && routeData){
        if(!routeData.id || routeData.id == ''){ return false; }
        Routes.insert(routeData);
      }
    },

    routeNodeSave: function(rId, user, nodesData){
      if(!ArrayHasDuplicate(nodesData)){
        Routes.update(
          { _id:rId},
          { $set: {
            'nodos': nodesData
          }}
        );
      }
    },

    removeRoute: function(rId, bId, user){
      if(rId){
        Routes.remove({ _id: rId.toString() });
      }
    },

    updateRoute: function(rId, user, routeData){
      if(rId && routeData){
        if(!routeData.id || routeData.id == ''){ return false; }

        Routes.update(
          { _id:routeData._id},
          { $set: {
            'id': routeData.id,
          }}
        );
      }
    },

  });
}