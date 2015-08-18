if (Meteor.isClient) {
    Template.eventRoomsList.helpers({
        hasRooms: function () {
            if(Session.get('edit-event')) {
                var roomsCount = Rooms.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}).count();
                return roomsCount>0;
            }
        },
        rooms: function () {
            if(Session.get('edit-event')) { return Rooms.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}); }
        }
    });
}
