Meteor.methods({
  hasProfileComplete: function(user){
    if(user && user.profile) {
      if(!user.profile.nombre || user.profile.nombre == ''){ return false; }
      if(!user.profile.apellido  || user.profile.apellido == '' ){ return false; }
      if(!user.profile.documento || user.profile.documento == '' ){ return false; }
      if(!user.profile.telefono  || user.profile.telefono == '' ){ return false; }
      if(!user.profile.telefonoEmergencia || user.profile.telefonoEmergencia == '' ){ return false; }
      if(!user.profile.obraSocial || user.profile.obraSocial == '' ){ return false; }
      return true;
    }
    return false;
  },

  isProfileValid: function(user){
    if(user && user.profile) {

      if(!user.profile.nombre || user.profile.nombre == ''){ return false; }
      if(!user.profile.apellido  || user.profile.apellido == '' ){ return false; }
      if(!user.profile.documento || user.profile.documento == '' ){ return false; }
      if(!user.profile.telefono  || user.profile.telefono == '' ){ return false; }
      if(!user.profile.telefonoEmergencia || user.profile.telefonoEmergencia == '' ){ return false; }
      if(!user.profile.obraSocial || user.profile.obraSocial == '' ){ return false; }

      if(!parseInt(user.profile.documento)){ return false; }
      if(!parseInt(user.profile.telefono)){ return false; }
      if(!parseInt(user.profile.telefonoEmergencia)){ return false; }

      //Pending: check only numbers on doc & phone
      return true;
    }
    return false;
  },

  updateUserProfile: function (data){
    Meteor.users.update({_id:data.id}, {$set: {
      "profile.nombre": data.nombre,
      "profile.apellido": data.apellido,
      "profile.documento": data.documento,
      "profile.telefono": data.telefono,
      "profile.telefonoEmergencia": data.telefonoEmergencia,
      "profile.obraSocial": data.obraSocial
    }});

    //console.log("Profile id: \""+data.id+"\" updated! (server side)");
  },

  userHasEvento: function(eId, user) {
    if(user.eventos) {
      for(var i = 0;i<user.eventos.length;i++) {
        if(user.eventos[i]._id == eId) { return true; }
      }
    }  
    return false;
  },

  userAttendingEvento: function(eId, user) {
    var results = Meteor.call('getUserAttendingEvents');
    for (var i = 0; i < results.data.length; i++) {
      if(eId == results.data[i].id) {

        //Investigar si este metodo es el mas eficiente. Ya que es disparado varias veces al loguear el HOME
        return true;
      }
    };
    return false;
  }
});

