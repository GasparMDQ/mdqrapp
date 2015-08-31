if (Meteor.isClient) {
  Template.busDetail.events({
    'click .js-check-in' : function (e) {
      e.preventDefault();
      var response = Meteor.call('busCheckIn', $(e.target).closest('div.js-bus').data('bus'), Meteor.user(), Session.get('event-id'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    }
  });
  Template.paxBusDetail.events({
    'click .js-check-out' : function (e) {
      e.preventDefault();
      var response = Meteor.call('busCheckOut', $(e.target).closest('div.js-bus').data('bus'), $(e.target).data('profile'), Session.get('event-id'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    }
  });
}
