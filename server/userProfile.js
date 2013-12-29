Meteor.methods({
  hasProfileComplete: function(user){
    if(user.profile) {
      if(user.profile.nombre == '' ){ return false; }
      if(user.profile.apellido == '' ){ return false; }
      if(user.profile.documento == '' ){ return false; }
      if(user.profile.telefono == '' ){ return false; }
      if(user.profile.telefonoEmergencia == '' ){ return false; }
      if(user.profile.obraSocial == '' ){ return false; }
      return true;
    }
    return false;
  },

  isProfileValid: function(user){
    if(user.profile) {
      if(user.profile.nombre == '' ){ return false; }
      if(user.profile.apellido == '' ){ return false; }
      if(user.profile.documento == '' ){ return false; }
      if(!parseInt(user.profile.documento)){ return false; }
      if(user.profile.telefono == '' ){ return false; }
      if(!parseInt(user.profile.telefono)){ return false; }
      if(user.profile.telefonoEmergencia == '' ){ return false; }
      if(!parseInt(user.profile.telefonoEmergencia)){ return false; }
      if(user.profile.obraSocial == '' ){ return false; }

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

    console.log("Profile id: \""+data.id+"\" updated! (server side)");
  },

  userHasEvento: function(eId, user) {
    if(user.eventos) {
      for(var i = 0;i<user.eventos.length;i++) {
        if(user.eventos[i]._id == eId) { return true; }
      }
    }  
    return false;
  }

});

