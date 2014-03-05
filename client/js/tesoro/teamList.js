if (Meteor.isClient) {

  Template.teamList.teams = function () {
    return Equipos.find({}, {sort: { 'id': 1}});
  };

  Template.teamDetail.isFull = function () {
    return this.cupo - this.pax.length <= 0;
  };

  Template.teamDetail.plazasDisponibles = function () {
    return this.cupo - this.pax.length;
  };

  Template.paxTeamDetail.user = function () {
    return Meteor.users.findOne({'_id': this.toString()});
  };

  Template.teamDetail.events({
    'click .js-check-in' : function (e) {
      e.preventDefault();
      var response = Meteor.call('teamCheckIn', $(e.target).closest('div.js-team').data('bus'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });
  Template.paxTeamDetail.events({
    'click .js-check-out' : function (e) {
      e.preventDefault();
      var response = Meteor.call('teamCheckOut', $(e.target).closest('div.js-team').data('bus'), $(e.target).data('profile'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

//Stubs
Meteor.methods({
  teamCheckIn: function(tId, user){
    if(tId){
      var reservas = Equipos.find({'pax': user._id}).count();
      if (reservas == 0){
        Equipos.update( { '_id': tId }, { $addToSet: { 'pax': user._id } } );
      } else {
        var team = Equipos.findOne({'pax': user._id});
        alert('Ya se esta en el equipo ' + team.id);
      }
    }
  },

  teamCheckOut: function(tId, userId){
    if(tId && Meteor.user()._id == userId){
      Equipos.update( { '_id': tId }, { $pull: { 'pax': Meteor.user()._id } } );
    }
  },
});

}