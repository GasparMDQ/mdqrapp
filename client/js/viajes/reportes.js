if (Meteor.isClient) {
  Template.eventReport.evento = function () {
    return Eventos.findOne({_id: Session.get('edit-event')});
  };  
  
  Template.eventReport.pax = function () {
    var paxList = [];

    Buses.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}).forEach(function (bus) {
      paxList = arrayUnique(paxList.concat(bus.pax));
    });
    Rooms.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}).forEach(function (room) {
      paxList = arrayUnique(paxList.concat(room.pax));
    });

    return paxList;
  };

  Template.paxReportDetail.user = function () {
    return Meteor.users.findOne({'_id': this.toString()});
  };
  Template.paxReportDetail.busDescripcion = function () {
    var bus = Buses.findOne({
        'eventId': Session.get('edit-event'),
        'pax': {$in : [this.toString()]}
      });
    if(typeof bus != 'undefined'){ return bus.descripcion; } else { return "---"; }
  };
  Template.paxReportDetail.roomDescripcion= function () {
    var room = Rooms.findOne({
        'eventId': Session.get('edit-event'),
        'pax': {$in : [this.toString()]}
      });
    if(typeof room != 'undefined'){ return room.descripcion; } else { return "---"; }
  };
}