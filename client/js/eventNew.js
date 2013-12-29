if (Meteor.isClient) {
  Template.eventNew.eventos = function () {
    if(Meteor.user()){
      return Meteor.user().eventos;
    }
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
      var response = Meteor.call('addNewEvent', $(e.target).data('event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

  //Stubs
  Meteor.methods({
    addNewEvent: function(eId, user){
      if(eId){
        Eventos.update({ _id : eId.toString() }, {
          _id : eId.toString(),
          name : 'Nuevo evento',
          shortDescripcion : 'Actualizando datos desde Facebook ...'
        }, {upsert:true});
      }
    }
  });  

}