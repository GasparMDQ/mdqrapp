Meteor.methods({
  refreshUserAttendingEvents: function(user){
    var results = Meteor.call('getUserAttendingEvents');
    var data = new Object(null);
    var addData = false;

    Meteor.users.update({_id:user._id}, {$set: {"eventos": []}}, {upsert: true});

    for (var i = 0; i < results.data.length; i++) {
      if(user.services.facebook.id == results.data[i].owner.id) {
        addData = true;
      } else {
        for (var j = 0; j < results.data[i].admins.data.length; j++) {
          if(user.services.facebook.id == results.data[i].admins.data[j].id) {
            addData = true;
          }
        };
      }

      if(addData){
        data._id = results.data[i].id;
        data.name = results.data[i].name;
        data.startTime = results.data[i].start_time;
        Meteor.users.update({_id:user._id}, {$addToSet: {"eventos": data}});
        addData=false;
      }
    };
  },

  addNewEvent: function(eId, user){
    Meteor.call('userHasEvento',eId, user, function (error, result){

      //Verifico que tenga los permisos necesarios para agregar eventos
      if(result && Roles.userIsInRole(user, ['admin','super-admin'])){
        var results = Meteor.call('getEventInfo', eId);

        //Se utiliza el ID del evento como _ID para la DB
        results._id = results.id;
        Eventos.insert(results);
      } else {
        console.log(error);
      }
    });
  }
});
