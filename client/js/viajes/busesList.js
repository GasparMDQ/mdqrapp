if (Meteor.isClient) {

  Template.busesList.micros = function () {
    if(Session.get('event-active') && Session.get('event-attending')) { return Buses.find({'eventId': Session.get('event-active')}, {sort: { 'id': 1}}); };
  };

  Template.busDetail.isFull = function () {
    return this.cupo - this.pax.length <= 0;
  };

  Template.busDetail.plazasDisponibles = function () {
    return this.cupo - this.pax.length < 0 ? 0:this.cupo - this.pax.length;
  };

  Template.paxBusDetail.user = function () {
    return Meteor.users.findOne({'_id': this.toString()});
  };

  Template.busDetail.events({
    'click .js-check-in' : function (e) {
      e.preventDefault();
      var response = Meteor.call('busCheckIn', $(e.target).closest('div.js-bus').data('bus'), Meteor.user(), Session.get('event-active'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });
  Template.paxBusDetail.events({
    'click .js-check-out' : function (e) {
      e.preventDefault();
      var response = Meteor.call('busCheckOut', $(e.target).closest('div.js-bus').data('bus'), $(e.target).data('profile'), Session.get('event-active'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

//Stubs
Meteor.methods({
  busCheckIn: function(bId, user, eId){
    if(bId){
      var reservas = Buses.find({'pax': user._id, 'eventId': eId}).count();
      if (reservas == 0){
        Buses.update( { '_id': bId }, { $addToSet: { 'pax': user._id } } );
      } else {
        var micro = Buses.findOne({'pax': user._id, 'eventId': eId});
        alert('Ya se tiene seleccionado el micro ' + micro.id);
      }
    }
  },

  busCheckOut: function(bId, userId, eId){
    if(bId && Meteor.user()._id == userId){
      Buses.update( { '_id': bId }, { $pull: { 'pax': Meteor.user()._id } } );
    }
  },
});

}