if (Meteor.isClient) {
    Meteor.methods({
        busAddNew: function(eId, user, busData){
            if(eId && busData){
                if(!busData.id || busData.id === ''){ return false; }
                if(!busData.descripcion  || busData.descripcion === '' ){ return false; }
                Buses.insert(busData);
            }
        },
        updateBus: function(bId, user, busData){
            if(bId && busData){
                if(!busData.id || busData.id === ''){ return false; }
                if(!busData.descripcion  || busData.descripcion === '' ){ return false; }
                Buses.update(
                    { _id:busData._id},
                    { $set: {
                        'id': busData.id,
                        'descripcion': busData.descripcion
                    }}
                );
            }
        },
        removeBus: function(bId, eId, user){
            if(bId){
                Buses.remove({ _id: bId.toString() });
            }
        },
        busCheckIn: function(bId, user, eId){
          if(bId){
            var reservas = Buses.find({'pax': user._id, 'eventId': eId}).count();
            if (reservas === 0){
              Buses.update( { '_id': bId }, { $addToSet: { 'pax': user._id } } );
            } else {
              var micro = Buses.findOne({'pax': user._id, 'eventId': eId});
              alert('Ya se tiene seleccionado el micro ' + micro.id);
            }
          }
        },

        busCheckOut: function(bId, userId, eId){
          if(bId && Meteor.user()._id == userId){
            Buses.update( { '_id': bId }, { $pull: { 'pax': Meteor.user()._id } } );
          }
        }
    });
}
