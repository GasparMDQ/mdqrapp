if (Meteor.isClient) {
    Meteor.methods({
        busAddNew: function(eId, user, busData){
            if(eId && busData){
                if(!busData.id || busData.id === ''){ return false; }
                if(!busData.descripcion  || busData.descripcion === '' ){ return false; }
                if(!busData.cupo || busData.cupo === '' ){ return false; }
                Buses.insert(busData);
            }
        },
        updateBus: function(bId, user, busData){
            if(bId && busData){
                if(!busData.id || busData.id === ''){ return false; }
                if(!busData.descripcion  || busData.descripcion === '' ){ return false; }
                if(!busData.cupo || busData.cupo === '' ){ return false; }
                Buses.update(
                    { _id:busData._id},
                    { $set: {
                        'id': busData.id,
                        'descripcion': busData.descripcion,
                        'cupo': busData.cupo
                    }}
                );
            }
        },
        removeBus: function(bId, eId, user){
            if(bId){
                Buses.remove({ _id: bId.toString() });
            }
        }
    });
}
