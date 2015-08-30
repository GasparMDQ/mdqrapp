var isBusValid = function (busData){
    if(busData) {
        if(!busData.id || busData.id === ''){ return false; }
        if(!busData.descripcion  || busData.descripcion === '' ){ return false; }
        if(!busData.cupo || busData.cupo === '' ){ return false; }
        if(busData.cupo < 0) { return false; }
        return true;
    }
    return false;
};

Meteor.methods({
    busAddNew: function(eId, user, busData){
        if (isBusValid(busData)) {
            //Verifico que tenga los permisos necesarios para agregar eventos
            if(Roles.userIsInRole(user, ['admin','super-admin'])){
                Buses.insert(busData);
            } else {
                console.log('Error:busAddNew: not allowed');
                throw new Meteor.Error("not-allowed",
                "El usuario no tiene permisos para agregar micros");
            }
        } else {
            throw new Meteor.Error("wrong-data",
            "Los datos enviados son incorrectos");
        }
    },

    updateBus: function(rId, user, busData){
        if (isBusValid(busData)) {
            //Verifico que tenga los permisos necesarios para agregar eventos
            if( Roles.userIsInRole(user, ['admin','super-admin'])){
                Buses.update(
                    { _id:busData._id},
                    { $set: {
                        'id': busData.id,
                        'descripcion': busData.descripcion,
                        'cupo': busData.cupo
                    }}
                );
            } else {
                console.log('Error:updateBus: not allowed');
                throw new Meteor.Error("not-allowed",
                "El usuario no tiene permisos para modificar micros");
            }
        } else {
            throw new Meteor.Error("wrong-data",
            "Los datos enviados son incorrectos");
        }
    },

    removeBus: function(rId, eId, user){
        //Verifico que tenga los permisos necesarios para editar el eventos
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            Buses.remove({ _id: rId.toString() });
        } else {
            console.log('Error:removeBus: ' + error);
            throw new Meteor.Error("not-allowed",
            "El usuario no tiene permisos para borrar micros");
        }
    },


    busCheckIn: function(bId, user, eId){
        //Veririco que se hayan pasado todos los parametros
        if(bId && user && eId){
            // @todo Verifico que el usuario tenga el evento y haya pagado la seña
            // @todo Verificar que tenga el perfil completo
            //Verifico que el usuario no este en otro micro del mismo evento
            Meteor.call('userHasBus',eId, user, function (error, result){
                //Verifico !result ya que necesito es necsario que NO tenga ya un micro
                if(typeof result != 'undefined' && !result){
                    //Verifico el habitacion tenga espacio disponible
                    Meteor.call('busIsAvailable',bId, function (error, result){
                        if(result){
                            Buses.update( { '_id': bId }, { $addToSet: { 'pax': user._id } } );
                        } else {
                            console.log('Error:busCheckIn:busIsAvailable: '+ error);
                        }
                    });
                } else {
                    console.log('Error:busCheckIn:userHasBus: '+ error);
                }
            });

        } else {
            console.log('Error:busCheckIn: faltan parametros');
        }
    },

    busCheckOut: function(bId, userId, eId){
        if(Meteor.user()._id === userId) {
            //Verifico que tenga los permisos necesarios para realizar el checkOut el eventos
            if(bId){
                Buses.update( { '_id': bId }, { $pull: { 'pax': Meteor.user()._id } } );
            } else {
                console.log('Error:busCheckOut: ' + error);
            }
        }
    },

    busIsAvailable: function(bId){
        var bus = Buses.findOne( { '_id': bId } );
        return bus.cupo - bus.pax.length > 0;
    },


});
