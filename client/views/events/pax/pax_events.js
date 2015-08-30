if (Meteor.isClient) {
    Template.paxEdit.events({
        'click .js-pago-toggle': function (e) {
            Meteor.call('togglePagoUser', this, function (error, result){
                if (error) { alert(error.message); }
            });
        },
        'click .js-remove-pax' : function (e) {
            e.preventDefault();
            if (confirm('Esta seguro que desea eliminar a este usuario del evento?\n(se borraran sus reservas de micro y habitacion)')) {
                var data = {
                    userId: this._id,
                    eventId: Eventos.findOne({'_id':Session.get('edit-event')})._id
                };
                var response = Meteor.call('userRemoveEvent',data, function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }
        },

    });

}
