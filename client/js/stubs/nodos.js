if (Meteor.isClient) {
  Meteor.methods({
    nodoAddNew: function(bId, user, nodoData){
      if(bId && nodoData){
        if(!nodoData.id || nodoData.id == ''){ return false; }
        if(!nodoData.question  || nodoData.question == '' ){ return false; }
        if(isNaN(nodoData.answer)){ return false; }
        Nodos.insert(nodoData);
      }
    },

    updateNodo: function(nId, user, nodoData){
      if(nId && nodoData){
        if(!nodoData.id || nodoData.id == ''){ return false; }
        if(!nodoData.question  || nodoData.question == '' ){ return false; }
        if(isNaN(nodoData.answer)){ return false; }

        Nodos.update(
          { _id:nodoData._id},
          { $set: {
            'id': nodoData.id,
            'question': nodoData.question,
            'answer': nodoData.answer,
            'lowOffset': nodoData.lowOffset,
            'highOffset': nodoData.highOffset,
            'zona': nodoData.zona,
          }}
        );
      }
    },

    removeNodo: function(nId, bId, user){
      if(nId){
        Nodos.remove({ _id: nId.toString() });
      }
    },
  });
};
