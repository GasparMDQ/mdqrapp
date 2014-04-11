Meteor.methods({
  isRouteValid: function(routeData){
    if(routeData) {
      if(!routeData.id || routeData.id == ''){ return false; }
      return true;
    }
    return false;
  },

  routeAddNew: function(bId, user, routeData){
    Meteor.call('isRouteValid', routeData, function (error, result){
      if (result && Roles.userIsInRole(user, ['admin','super-admin'])) {
        Routes.insert(routeData);
      } else {
        if(error){
          console.log('Error:isRouteValid: ' + error);
        } else {
          if(!result) {
            console.log('Error:isRouteValid: routeData not valid');
          } else {
            console.log('Error:routeAddNew: not allowed');
          }
        }
      }
    });
  },

  routeNodeSave: function(rId, user, nodesData){
    if(Roles.userIsInRole(user, ['admin', 'super-admin']) && !ArrayHasDuplicate(nodesData)) {
      Routes.update(
        { _id:rId},
        { $set: {
          'nodos': nodesData
        }}
      );
    } else {
      console.log('Error:routeAddNew: not allowed');
    }
  },

  removeRoute: function(rId, bId, user){
    if(rId && Roles.userIsInRole(user, ['admin','super-admin'])) {
      Routes.remove({ _id: rId.toString() });
    } else {
      console.log('Error:removeRoute: not allowed');
    }
  },

  updateRoute: function(rId, user, routeData){
    if(rId && routeData){
      Meteor.call('isRouteValid', routeData, function (error, result){
        if (result && Roles.userIsInRole(user, ['admin','super-admin'])) {
          Route.update(
            { _id:routeData._id},
            { $set: {
              'id': routeData.id,
            }}
          );
        } else {
          if(error){
            console.log('Error:isRouteValid: ' + error);
          } else {
            if(!result) {
              console.log('Error:isRouteValid: routeData not valid');
            } else {
              console.log('Error:updateRoute: not allowed');
            }
          }
        }
      });
    }
  },

});