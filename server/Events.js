var validateEvent = function(evento) {
    var response = { isValid: true, errors: []};

    if(evento.name === '') { response.errors.push('Debe ingresar un nombre al evento'); }
    if(evento.shortDescripcion === '') { response.errors.push('Debe ingresar una descripcion'); }
    if(evento.description === '') { response.errors.push('Debe ingresar la informacion del evento'); }
    if(evento.start_time === '') { response.errors.push('Debe ingresar la fecha y hora de comienzo'); }
    if(evento.end_time === '') { response.errors.push('Debe ingresar la fecha y hora de finalizacion'); }
    if(evento.costo === '') { response.errors.push('Debe ingresar el costo del evento'); }

    response.isValid = response.errors.length === 0;
    return response;
};

Meteor.methods({
    addNewEvent: function(evento, user){
        var e = validateEvent(evento);
        if(!e.isValid){
            throw new Meteor.Error("not-valid","Campos incompletos",
            e.errors.join("\r\n"));
        }
        //Verifico que tenga los permisos necesarios para agregar eventos
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            //Se usa update con {upsert:true} para evitar errores por claves duplicadas en caso de multiples clicks
            eId = Eventos.insert(evento);
            return eId;
        } else {
            console.log('Error:addNewEvent: not allowed');
            throw new Meteor.Error("not-allowed",
            "El usuario no tiene permisos para crear eventos");
        }
    },

    setActiveEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para activar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Eventos.update({ _id: { $ne: eId.toString() }}, { $set: { active: false }}, {multi: true});
            Eventos.update({ _id: eId.toString() }, { $set: { active: true }});
        } else {
            console.log('Error:setActiveEvent: ' + error);
        }
    },

    unSetActiveEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para desactivar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Eventos.update({ _id: eId.toString() }, { $set: { active: false }});
        } else {
            console.log('Error:unSetActiveEvent: ' + error);
        }
    },

    removeEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para borrar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Rooms.remove({ eventId: eId.toString() });
            Eventos.remove({ _id: eId.toString() });
        } else {
            console.log('Error:removeEvent: ' + error);
        }
    },

    setRegisterEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para desactivar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Eventos.update({ _id: eId.toString() }, { $set: { registracion: true }});
        } else {
            console.log('Error:setRegisterEvent: ' + error);
        }
    },

    unSetRegisterEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para desactivar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Eventos.update({ _id: eId.toString() }, { $set: { registracion: false }});
        } else {
            console.log('Error:unSetRegisterEvent: ' + error);
        }
    },
    setChismeEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para desactivar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Eventos.update({ _id: eId.toString() }, { $set: { chismografo: true }});
        } else {
            console.log('Error:setChismeEvent: ' + error);
        }
    },

    unSetChismeEvent: function(eId, user){
        //Verifico que tenga los permisos necesarios para desactivar eventos
        if(
            (Roles.userIsInRole(user, ['admin'])) ||
            Roles.userIsInRole(user, ['super-admin'])
        ){
            Eventos.update({ _id: eId.toString() }, { $set: { chismografo: false }});
        } else {
            console.log('Error:unSetChismeEvent: ' + error);
        }
    },

    refreshEventData: function(eId, user){

        //Verifico que tenga los permisos necesarios para agregar eventos
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            var evento = Meteor.call('getEventInfo', eId);

            if (evento.description){
                evento.shortDescripcion = Trunc(evento.description,200,true);
            }

            Eventos.update({ _id:eId}, {$set: evento}, {upsert:true});
        } else {
            if(error){
                console.log('Error:userHasEvento: ' + error);
            } else {
                console.log('Error:addNewEvent: not allowed');
            }

        }
    },
});
