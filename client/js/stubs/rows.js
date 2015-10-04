Meteor.methods({
    addRowToBus: function(busId, eId, user){
        index = Rows.find({'busId': busId}).count();
        Rows.insert({
            'eventId': eId,
            'busId': busId,
            'index': index+1,
            'elements': []
        });
    },
    removeRow: function(rId, user){
        if(rId){
            Rows.remove({ _id: rId.toString() });
        }
    },
    addElement: function(rId, user, element){
        row = Rows.findOne({'_id':rId.toString() });
        element.index = row.elements.length;
        element.row = rId;
        Rows.update( { '_id': rId }, { $addToSet: { 'element': element } } );
    },

    clearElements: function(rId, user){
        Rows.update( { '_id': rId }, { $set: { 'elements': [] } } );
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
