if (Meteor.isClient) {
    Template.eventBusList.helpers({
        hasBuses: function () {
            if(Session.get('edit-event')) {
                var busesCount = Buses.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}).count();
                return busesCount>0;
            }
        },
        buses: function () {
            if(Session.get('edit-event')) { return Buses.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}); }
        },
    });
    Template.busEdit.helpers({
        rows: function () {
            return Rows.find({'busId': this._id}, {sort: { 'index': 1}}); 
        }
    });
}
