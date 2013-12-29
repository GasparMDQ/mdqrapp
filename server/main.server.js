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
  Roles.addUsersToRoles(user, 'user');
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

Meteor.publish('events', function(userId){
  if (Roles.userIsInRole(userId, ['super-admin'])){
    //Todos
  console.log('User:Role:super-admin');
    return Eventos.find();
  }

  if (Roles.userIsInRole(userId, ['admin'])){
    //Activo + los propios
  console.log('User:Role:admin');
    return Eventos.find();
  }

  if (Roles.userIsInRole(userId, ['user'])){
    //Solo activo
  console.log('User:Role:user');
    return Eventos.find();
  }
  console.log('User:Role:none');
  this.stop();
  return;
});

//Config de Roles
//Roles.createRole('super-admin');
//Roles.createRole('admin');
//Roles.createRole('user');
//Roles.addUsersToRoles('h4FNibnjGG2heK3a6', 'super-admin'); //<<-- Poner ID del super admin