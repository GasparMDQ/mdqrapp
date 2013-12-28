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
  user.eventos = [];
  if(options.profile) {
    options.profile.picture = getFbPicture(user.services.facebook.accessToken);
    user.profile = options.profile;
  }
  return user;
})

Meteor.methods({});

Meteor.publish('users', function(){
  return Meteor.users.find({_id:this.userId});
});

Meteor.publish('events', function(){
  return Eventos.find();
});

//Config de Roles
//Roles.createRole('super-admin');
//Roles.createRole('admin');
//Roles.createRole('user');
//Roles.addUsersToRoles('h4FNibnjGG2heK3a6', 'super-admin'); //<<-- Poner ID del super admin