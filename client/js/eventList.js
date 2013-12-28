if (Meteor.isClient) {
  Template.eventList.userLogged = function () {
    return Meteor.user();
  };

  Template.eventList.eventos = function () {
    var eventosUsuario = function(usr){
      var data = [];
      for(var i=0;i<usr.eventos.length; i++){
        data.push(usr.eventos[i]._id);
      }
      return data;
    };
    
    if (Meteor.user() && Meteor.user().eventos){
      return Eventos.find({
        _id: { $in: eventosUsuario(Meteor.user()) }
      }).fetch();
    }
  };

  Template.eventList.events({
    'click .js-set-active' : function (e) {
      e.preventDefault();
      var eId = $(e.target).data('event');
      var response = Meteor.call('setActiveEvent', eId, Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    },

    'click .js-set-deactive' : function (e) {
      e.preventDefault();
      var eId = $(e.target).data('event');

      var response = Meteor.call('setUnActiveEvent', eId, Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

//Stubs
Meteor.methods({
  setActiveEvent: function(eId, user){
    if(eId){
      Eventos.update({ _id: { $ne: eId.toString() }}, { $set: { active: false }}, {multi: true});
      Eventos.update({ _id: eId.toString() }, { $set: { active: true }});
    }
  },

  setUnActiveEvent: function(eId, user){
    if(eId){
      Eventos.update({ _id: eId.toString() }, { $set: { active: false }});
    }
  }
});

}