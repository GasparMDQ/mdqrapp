if (Meteor.isClient) {
  Template.evento.eId = function () {
    //Setting data context for links
    return {_id: this._id};
  };

  Template.eventList.userLogged = function () {
    return Meteor.user();
  };

  Template.eventList.eventos = function () {
    if (Roles.userIsInRole(Meteor.user(), ['super-admin'])){
      return Eventos.find();
    }    

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
      },{
        sort: {
          active: -1,
          start_time:1
        }
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
      var confirmation = confirm('Desea eliminar este evento?');
      if (confirmation == true ) {
        var response = Meteor.call('removeEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
          if (error) {
            alert(error.message);
          }
        });
      }
    },

    'click .js-set-deactive' : function (e) {
      e.preventDefault();
      var response = Meteor.call('unSetActiveEvent', $(e.target).closest('div.js-evento').data('event'), Meteor.user(), function (error, result){
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

  unSetActiveEvent: function(eId, user){
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