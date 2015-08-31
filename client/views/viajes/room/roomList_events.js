if (Meteor.isClient) {
  Template.roomDetail.events({
    'click .js-check-in' : function (e) {
      e.preventDefault();
      var response = Meteor.call('roomCheckIn', $(e.target).closest('div.js-room').data('room'), Meteor.user(), Session.get('event-id'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    }
  });
  Template.paxRoomDetail.events({
    'click .js-check-out' : function (e) {
      e.preventDefault();
      var response = Meteor.call('roomCheckOut', $(e.target).closest('div.js-room').data('room'), $(e.target).data('profile'), Session.get('event-id'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    }
  });

}
