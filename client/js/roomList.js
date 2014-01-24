if (Meteor.isClient) {

  Template.roomsList.habitaciones = function () {
    if(Session.get('event-active') && Session.get('event-attending')) { return Rooms.find({'eventId': Session.get('event-active')}, {sort: { 'id': 1}}); };
  };

  Template.roomDetail.isFull = function () {
    return this.cupo - this.pax.length <= 0;
  };

  Template.roomDetail.plazasDisponibles = function () {
    return this.cupo - this.pax.length;
  };

  Template.paxDetail.user = function () {
    return Meteor.users.findOne({'_id': this.toString()});
  };

  Template.roomDetail.events({
    'click .js-check-in' : function (e) {
      e.preventDefault();
      var response = Meteor.call('roomCheckIn', $(e.target).closest('div.js-room').data('room'), Meteor.user(), Session.get('event-active'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });
  Template.paxDetail.events({
    'click .js-check-out' : function (e) {
      e.preventDefault();
      var response = Meteor.call('roomCheckOut', $(e.target).closest('div.js-room').data('room'), $(e.target).data('profile'), Session.get('event-active'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

//Stubs
Meteor.methods({
  roomCheckIn: function(rId, user, eId){
    if(rId){
      var reservas = Rooms.find({'pax': user._id, 'eventId': eId}).count();
      if (reservas == 0){
        Rooms.update( { '_id': rId }, { $addToSet: { 'pax': user._id } } );
      } else {
        var habitacion = Rooms.findOne({'pax': user._id, 'eventId': eId});
        alert('Ya se tiene seleccionada la habitación ' + habitacion.id);
      }
    }
  },

  roomCheckOut: function(rId, userId, eId){
    if(rId && Meteor.user()._id == userId){
      Rooms.update( { '_id': rId }, { $pull: { 'pax': Meteor.user()._id } } );
    }
  },
});

}