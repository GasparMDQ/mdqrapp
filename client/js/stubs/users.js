if (Meteor.isClient) {
    Meteor.methods({
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
                    "eventos": _.uniq(eventos)
                }});
            }
        },
        togglePagoUser: function(user){
            Meteor.users.update({ '_id': user._id }, { $set: { 'pago': !user.pago }});
        },
        toggleSenaUser: function(user){
            Meteor.users.update({ '_id': user._id }, { $set: { 'sena': !user.sena }});
        },

    });
}
