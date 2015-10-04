if (Meteor.isClient) {
    Template.busesList.helpers({
        micros: function (evento) {
            if(evento && Session.get('event-active')) { return Buses.find({'eventId': evento._id}, {sort: { 'id': 1}}); }
        }
    });
    Template.busDetail.helpers({
        isFull: function () {
            return this.cupo - this.pax.length <= 0;
        },

        plazasDisponibles: function () {
            return this.cupo - this.pax.length < 0 ? 0:this.cupo - this.pax.length;
        },

        filas: function () {
            return Rows.find({'busId': this._id}, {sort: { 'index': 1}});
        },

        elementos: function () {
            return _.sortBy(this.elements, function(e) { return e.index; });
        }

    });
    Template.paxBusDetail.helpers({
        user: function () {
            return Meteor.users.findOne({'_id': this.toString()});
        }
    });
}
