var Trunc = function(string, n, useWordBoundary){
  var toLong = string.length>n,
  s_ = toLong ? string.substr(0,n-1) : string;
  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  return  toLong ? s_ + ' ...' : s_;
};

Meteor.methods({
  isNodoValid: function(nodoData){
    if(nodoData) {
      if(!nodoData.id || nodoData.id == ''){ return false; }
      if(!nodoData.question  || nodoData.question == '' ){ return false; }
      if(isNaN(nodoData.answer)){ return false; }

      if(nodoData.lowOffset < 0) { return false; }
      if(nodoData.highOffset < 0) { return false; }

      if(nodoData.latitude && (nodoData.latitude>90 || nodoData.latitude<-90)) { return false; }
      if(nodoData.longitude && (nodoData.longitude>180 || nodoData.longitude<-180)){ return false; }

      return true;
    }
    return false;
  },

  nodoAddNew: function(nId, user, nodoData){
    Meteor.call('isNodoValid', nodoData, function (error, result){
      if (result && Roles.userIsInRole(user, ['admin','super-admin'])) {
        Nodos.insert(nodoData);
      } else {
        if(error){
          console.log('Error:isNodoValid: ' + error);
        } else {
          if(!result) {
            console.log('Error:isNodoValid: nodoData not valid');
          } else {
            console.log('Error:nodoAddNew: not allowed');
          }
        }
      }
    });
  },

  updateNodo: function(nId, user, nodoData){
    if(nId && nodoData){
      Meteor.call('isNodoValid', nodoData, function (error, result){
        if (result && Roles.userIsInRole(user, ['admin','super-admin'])) {
          Nodos.update(
            { _id:nodoData._id},
            { $set: {
              'id': nodoData.id,
              'question': nodoData.question,
              'answer': nodoData.answer,
              'lowOffset': nodoData.lowOffset,
              'highOffset': nodoData.highOffset,
              'latitude': nodoData.latitude,
              'longitude': nodoData.longitude,
            }}
          );
        } else {
          if(error){
            console.log('Error:isNodoValid: ' + error);
          } else {
            if(!result) {
              console.log('Error:isNodoValid: nodoData not valid');
            } else {
              console.log('Error:updateNodo: not allowed');
            }
          }
        }
      });
    }
  },

  removeNodo: function(nId, bId, user){
    if(nId && Roles.userIsInRole(user, ['admin','super-admin'])) {
      Nodos.remove({ _id: nId.toString() });
    } else {
      console.log('Error:removeNodo: not allowed');
    }
  },
});
