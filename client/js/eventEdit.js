if (Meteor.isClient) {
  Template.eventEdit.userLogged = function () {
    return Meteor.user();
  };

  Template.eventEdit.eId = function () {
    return Session.get('edit-event');
  };


  Template.eventEdit.events({
    'click .js-set-active' : function (e) {
      e.preventDefault();
      var response = Meteor.call('setActiveEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    },
  });

//Stubs
Meteor.methods({
});

}