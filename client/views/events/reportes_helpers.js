if (Meteor.isClient) {
    Template.eventReport.helpers({
        evento: function(){
            return Eventos.findOne({_id:Session.get('edit-event')});
        },
        pax: function () {
            return Meteor.users.find({'eventos': this._id}, {sort: { 'profile.name': 1}});
        }
    });

    Template.paxReportDetail.helpers({
        busDescripcion: function () {
            var row = Rows.findOne({
                'eventId': Session.get('edit-event'),
                'elements.pax': this._id
            });
            if(typeof row === 'undefined'){ return "---"; }

            var bus = Buses.findOne({"_id": row.busId});
            if(typeof bus !== 'undefined'){ return bus.id; } else { return "---"; }
        },
        roomDescripcion: function(){
            var room = Rooms.findOne({
                'eventId': Session.get('edit-event'),
                'pax': {$in : [this._id]}
            });
            if(typeof room !== 'undefined'){ return room.id; } else { return "---"; }
        }
    });



}
