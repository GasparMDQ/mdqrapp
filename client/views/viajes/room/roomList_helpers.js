if (Meteor.isClient) {
    Template.roomsList.helpers({
        habitaciones: function (evento) {
            if(evento && Session.get('event-active')) { return Rooms.find({'eventId': evento._id}, {sort: { 'id': 1}}); }
        }
    });
    Template.roomDetail.helpers({
        isFull: function () {
            return this.cupo - this.pax.length <= 0;
        },

        plazasDisponibles: function () {
            return this.cupo - this.pax.length < 0 ? 0:this.cupo - this.pax.length;
        }
    });
    Template.paxRoomDetail.helpers({
        user: function () {
            return Meteor.users.findOne({'_id': this.toString()});
        }
    });
}
