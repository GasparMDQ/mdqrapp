Meteor.methods({
    isRoomValid: function(roomData){
        if(roomData) {
            if(!roomData.id || roomData.id === ''){ return false; }
            if(!roomData.descripcion  || roomData.descripcion === '' ){ return false; }
            if(!roomData.cupo || roomData.cupo === '' ){ return false; }
            if(roomData.cupo < 0) { return false; }
            return true;
        }
        return false;
    },

    roomAddNew: function(eId, user, roomData){
        Meteor.call('isRoomValid',roomData, function (error, result){
            if (result) {
                //Verifico que tenga los permisos necesarios para agregar eventos
                if(Roles.userIsInRole(user, ['admin','super-admin'])){
                    Rooms.insert(roomData);
                } else {
                    console.log('Error:roomAddNew: not allowed');
                    throw new Meteor.Error("not-allowed",
                      "El usuario no tiene permisos para agregar habitaciones");
                }
            }
        });
    },

    updateRoom: function(rId, user, roomData){
        Meteor.call('isRoomValid',roomData, function (error, result){
            if (result) {
                //Verifico que tenga los permisos necesarios para agregar eventos
                if(Roles.userIsInRole(user, ['admin','super-admin'])){
                    Rooms.update(
                        { _id:roomData._id},
                        { $set: {
                            'id': roomData.id,
                            'descripcion': roomData.descripcion,
                            'cupo': roomData.cupo
                        }}
                    );
                } else {
                    console.log('Error:updateRoom: not allowed');
                    throw new Meteor.Error("not-allowed",
                      "El usuario no tiene permisos para modificar habitaciones");
                }
            }
        });
    },

    removeRoom: function(rId, eId, user){
        //Verifico que tenga los permisos necesarios para editar el eventos
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            Rooms.remove({ _id: rId.toString() });
        } else {
            console.log('Error:removeRoom: ' + error);
            throw new Meteor.Error("not-allowed",
              "El usuario no tiene permisos para borrar habitaciones");                    
        }
    },

    roomCheckIn: function(rId, user, eId){
        //Veririco que se hayan pasado todos los parametros
        if(rId && user && eId){
            //Verifico que el usuario tenga el evento
            Meteor.call('userAttendingEvento',eId, user, function (error, result){
                if(result){
                    //Verifico que el usuario no este en otra habitacion del mismo evento
                    Meteor.call('userHasRoom',eId, user, function (error, result){
                        //Verifico !result ya que necesito es necsario que NO tenga ya habitacion
                        if(typeof result != 'undefined' && !result){
                            //Verifico la habitacion tenga espacio disponible
                            Meteor.call('roomIsAvailable',rId, function (error, result){
                                if(result){
                                    Rooms.update( { '_id': rId }, { $addToSet: { 'pax': user._id } } );
                                } else {
                                    console.log('Error:roomCheckIn:roomIsAvailable: '+ error);
                                }
                            });
                        } else {
                            console.log('Error:roomCheckIn:userHasRoom: '+ error);
                        }
                    });

                } else {
                    console.log('Error:roomCheckIn:userAttendingEvento: '+ error);
                }
            });
        } else {
            console.log('Error:roomCheckIn: faltan parametros');
        }
    },

    roomCheckOut: function(rId, userId, eId){
        if(Meteor.user()._id === userId) {
            Meteor.call('userAttendingEvento',eId, Meteor.user(), function (error, result){
                //Verifico que tenga los permisos necesarios para realizar el checkOut el eventos
                if(result && rId){
                    Rooms.update( { '_id': rId }, { $pull: { 'pax': Meteor.user()._id } } );
                } else {
                    console.log('Error:roomCheckOut: ' + error);
                }
            });
        }
    },

    roomIsAvailable: function(rId){
        var room = Rooms.findOne( { '_id': rId } );
        return room.cupo - room.pax.length > 0;
    },

});
