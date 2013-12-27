if (Meteor.isClient) {
  Template.eventNew.eventos = function () {
    return Meteor.user().eventos;
  };

  Template.eventNew.events({
    'click #facebook-refresh-events' : function (e) {
      e.preventDefault();
      //Use Call to execute insert on server side after
      //checking data complete
      var response = Meteor.call('refreshUserAttendingEvents',Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    }
  });


  Template.eventNewShow.existeEvento = function () {
    var result = Eventos.find(this._id).fetch();
    return result;
  };

  Template.eventNewShow.events({
    'click .js-add-event' : function (e) {
      e.preventDefault();
      var eId = parseInt($(e.target).data('event'));
      var response = Meteor.call('addNewEvent', eId, Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

}