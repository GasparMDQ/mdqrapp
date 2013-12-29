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
      var response = Meteor.call('setActiveEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    },

    'click .js-event-remove' : function (e) {
      e.preventDefault();
      var response = Meteor.call('removeEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    },

    'click .js-set-deactive' : function (e) {
      e.preventDefault();
      var response = Meteor.call('setUnActiveEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
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
  },

  removeEvent: function(eId, user){
    if(eId){
      Eventos.remove({ _id: eId.toString() });
    }
  }
});

}