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

  user.roles = ['user'];

  //Not working!
  //Roles.addUsersToRoles(user._id, 'user');
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
    return Eventos.find();
  }

  if (Roles.userIsInRole(userId, ['admin']) && userId.services && userId.services.facebook){
    //Activo + los propios
    return Eventos.find( {$or: [{active:true}, { 'owner.id': userId.services.facebook.id}, {'admins.data.id': userId.services.facebook.id}]} );
  }

  if (Roles.userIsInRole(userId, ['user'])){
    //Solo activo
    return Eventos.find({active:true});
  }
  console.log('User:Role:none');
  this.stop();
  return;
});

Meteor.publish('rooms', function(eventId, userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    return Rooms.find();
  }
  
  if (eventId){
    return Rooms.find( {'eventId': eventId });
  }

  console.log('Rooms:Event:none');
  this.stop();
  return;
});

Meteor.publish('buses', function(eventId, userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    return Buses.find();
  }

  if (eventId){
    return Buses.find( {'eventId': eventId });
  }

  console.log('Buses:Event:none');
  this.stop();
  return;
});

//Config de Roles
//Roles.createRole('super-admin');
//Roles.createRole('admin');
//Roles.createRole('user');
//Roles.addUsersToRoles('h4FNibnjGG2heK3a6', 'super-admin'); //<<-- Poner ID del super admin