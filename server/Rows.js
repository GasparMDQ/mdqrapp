Meteor.methods({
    addRowToBus: function(busId, eId, user){
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            index = Rows.find({'busId': busId}).count();
            Rows.insert({
                'eventId': eId,
                'busId': busId,
                'index': index+1,
                'elements': []
            });
        } else {
            console.log('Error:addRowToBus: not allowed');
            throw new Meteor.Error("not-allowed",
            "El usuario no tiene permisos para agregar filas");
        }
    },

    removeRow: function(rId, user){
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            Rows.remove({ '_id': rId.toString() });
        } else {
            console.log('Error:removeRow');
            throw new Meteor.Error("not-allowed",
            "El usuario no tiene permisos para borrar filas");
        }
    },

    addElement: function(rId, user, element){
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            row = Rows.findOne({'_id':rId.toString() });
            element.index = row.elements.length;
            element.row = rId;
            Rows.update( { '_id': rId }, { $addToSet: { 'elements': element } } );
        } else {
            console.log('Error:addElementToRow');
            throw new Meteor.Error("not-allowed",
            "El usuario no tiene permisos para agregar elementos");
        }
    },

    clearElements: function(rId, user){
        if(Roles.userIsInRole(user, ['admin','super-admin'])){
            Rows.update( { '_id': rId }, { $set: { 'elements': [] } } );
        } else {
            console.log('Error:removeElement');
            throw new Meteor.Error("not-allowed",
            "El usuario no tiene permisos para borrar elementos");
        }
    },

    seatCheckIn: function(element, user){
        element.pax = user._id;
        row = Rows.findOne({"_id":element.row});
        row.elements = _.filter(row.elements, function(e) { return e.index !== element.index; });
        row.elements.push(element);
        Rows.update( { '_id': element.row }, { $set: { 'elements': row.elements } } );
    },
    seatCheckOut: function(eventId, user){
        rows = Rows.find({"eventId": eventId, "elements.pax": user._id}).fetch();
        _.each(rows, function (r) {
            for (var i = 0; i < r.elements.length; i++) {
                if ('pax' in r.elements[i] && r.elements[i].pax === Meteor.user()._id){
                    r.elements[i].pax = '';
                }
            }
            Rows.update( {'_id': r._id}, { $set: {'elements': r.elements } } );
        });
    },



});
