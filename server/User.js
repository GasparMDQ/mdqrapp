Meteor.methods({
    hasProfileComplete: function(user){
        if(user && user.profile) {
            if(!user.profile.nombre || user.profile.nombre === ''){ return false; }
            if(!user.profile.apellido  || user.profile.apellido === '' ){ return false; }
            if(!user.profile.documento || user.profile.documento === '' ){ return false; }
            if(!user.profile.telefono  || user.profile.telefono === '' ){ return false; }
            if(!user.profile.telefonoEmergencia || user.profile.telefonoEmergencia === '' ){ return false; }
            if(!user.profile.obraSocial || user.profile.obraSocial === '' ){ return false; }
            return true;
        }
        return false;
    },

    isProfileValid: function(user){
        if(user && user.profile) {

            if(!user.profile.nombre || user.profile.nombre === ''){ return false; }
            if(!user.profile.apellido  || user.profile.apellido === '' ){ return false; }
            if(!user.profile.documento || user.profile.documento === '' ){ return false; }
            if(!user.profile.telefono  || user.profile.telefono === '' ){ return false; }
            if(!user.profile.telefonoEmergencia || user.profile.telefonoEmergencia === '' ){ return false; }
            if(!user.profile.obraSocial || user.profile.obraSocial === '' ){ return false; }

            if(!parseInt(user.profile.documento)){ return false; }
            if(!parseInt(user.profile.telefono)){ return false; }
            if(!parseInt(user.profile.telefonoEmergencia)){ return false; }

            //Pending: check only numbers on doc & phone
            return true;
        }
        return false;
    },

    updateUserProfile: function (data){
        Meteor.users.update({_id:data.id}, {$set: {
            "profile.nombre": data.nombre,
            "profile.apellido": data.apellido,
            "profile.documento": data.documento,
            "profile.telefono": data.telefono,
            "profile.telefonoEmergencia": data.telefonoEmergencia,
            "profile.obraSocial": data.obraSocial
        }});

        //console.log("Profile id: \""+data.id+"\" updated! (server side)");
    },

    userHasEvento: function(eId, user) {
        if(user.eventos) {
            for(var i = 0;i<user.eventos.length;i++) {
                if(user.eventos[i]._id === eId) { return true; }
            }
        }
        return false;
    },

    userHasRoom: function(eId, user) {
        var results = Rooms.findOne({
            'pax': { $in: [user._id] },
            'eventId': eId
        });

        if(results) {
            return true;
        }
        return false;
    },

    userHasBus: function(eId, user) {
        var results = Buses.findOne({
            'pax': { $in: [user._id] },
            'eventId': eId
        });

        if(results) {
            return true;
        }
        return false;
    },

    userAttendingEvento: function(eId, user) {
        var results = Meteor.call('getUserAttendingEvents',user);
        if(results.data){
            for (var i = 0; i < results.data.length; i++) {
                if(eId === results.data[i].id) {

                    //Investigar si este metodo es el mas eficiente. Ya que es disparado varias veces al loguear el HOME
                    return true;
                }
            }
        }
        return false;
    },
    togglePagoUser: function(user){
        if(
            (Roles.userIsInRole(Meteor.user(), ['admin'])) ||
            Roles.userIsInRole(Meteor.user(), ['super-admin'])
        ){
            if(!user.hasOwnProperty('pago')) { user.pago = false; }
            Meteor.users.update({ '_id': user._id }, { $set: { 'pago': !user.pago }});
        } else {
            throw new Meteor.Error("not-allowed",
              "El usuario no tiene permisos para editar pagos");
        }

    },
    userAddEvent: function(data){
        var eventos = Meteor.user().eventos;
        eventos.push(data.eventId);
        Meteor.users.update({_id:Meteor.user()._id}, {$set: {
            "eventos": _.uniq(eventos)
        }});
    },
    userRemoveEvent: function(data){
        var eventos = Meteor.user().eventos;
        var index = _.indexOf(eventos, data.eventId);

        if (index > -1) {
            eventos.splice(index, 1);
            Meteor.users.update({_id:Meteor.user()._id}, {$set: {
                "eventos": _.uniq(eventos),
                "pago": false
            }});

            // Checkout del cuarto
            var room = Rooms.findOne({
                'pax': { $in: [Meteor.user()._id] },
                'eventId': data.eventId
            });
            if(room) {
                Rooms.update( { '_id': room._id }, { $pull: { 'pax': Meteor.user()._id } } );
            }

            // Checkout del micro
            var bus = Buses.findOne({
                'pax': { $in: [Meteor.user()._id] },
                'eventId': data.eventId
            });
            if(bus) {
                Buses.update( { '_id': bus._id }, { $pull: { 'pax': Meteor.user()._id } } );
            }

        }
    }

});
