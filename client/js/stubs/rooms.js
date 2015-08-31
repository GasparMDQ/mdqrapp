if (Meteor.isClient) {
    Meteor.methods({
        roomAddNew: function(eId, user, roomData){
            if(eId && roomData){
                if(!roomData.id || roomData.id === ''){ return false; }
                if(!roomData.descripcion  || roomData.descripcion === '' ){ return false; }
                if(!roomData.cupo || roomData.cupo === '' ){ return false; }
                Rooms.insert(roomData);
            }
        },
        updateRoom: function(rId, user, roomData){
            if(rId && roomData){
                if(!roomData.id || roomData.id === ''){ return false; }
                if(!roomData.descripcion  || roomData.descripcion === '' ){ return false; }
                if(!roomData.cupo || roomData.cupo === '' ){ return false; }
                Rooms.update(
                    { _id:roomData._id},
                    { $set: {
                        'id': roomData.id,
                        'descripcion': roomData.descripcion,
                        'cupo': roomData.cupo
                    }}
                );
            }
        },
        removeRoom: function(rId, eId, user){
            if(rId){
                Rooms.remove({ _id: rId.toString() });
            }
        },

        roomCheckIn: function(rId, user, eId){
            if(rId){
                var reservas = Rooms.find({'pax': user._id, 'eventId': eId}).count();
                if (reservas === 0){
                    Rooms.update( { '_id': rId }, { $addToSet: { 'pax': user._id } } );
                } else {
                    var habitacion = Rooms.findOne({'pax': user._id, 'eventId': eId});
                    alert('Ya se tiene seleccionada la habitación ' + habitacion.id);
                }
            }
        },

        roomCheckOut: function(rId, userId, eId){
            if(rId && Meteor.user()._id == userId){
                Rooms.update( { '_id': rId }, { $pull: { 'pax': Meteor.user()._id } } );
            }
        },

    });
}
