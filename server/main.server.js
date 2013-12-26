var getFbPicture = function(accessToken) {
  var result;
  result = Meteor.http.get("https://graph.facebook.com/me", {
    params: {
      access_token: accessToken,
      fields: 'picture'
    }
  });
  if(result.error){
    throw result.error;
  }
  return result.data.picture.data.url;
}

Accounts.onCreateUser(function(options, user) {
  if(options.profile) {
    options.profile.picture = getFbPicture(user.services.facebook.accessToken);
    user.profile = options.profile;
  }
  return user;
})

Meteor.methods({
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
});

Meteor.publish('users', function(){
  return Meteor.users.find({_id:this.userId});
});

Meteor.publish('events', function(){
  return Eventos.find();
});