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
    });
}
