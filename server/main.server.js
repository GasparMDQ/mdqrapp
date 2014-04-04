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

Meteor.publish('userData', function(){
  return Meteor.users.find({_id:this.userId});
});

//Pasar usuario para filtrar datos que se envian de acuerdo a perfil
Meteor.publish('nodos', function(userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    //Todos
    return Nodos.find();
  }

  if (Roles.userIsInRole(userId, ['user'])){
    //Ver si es necesario devolver algo en caso de solo ser un usuario
    //return Nodos.find({active:true});
  }
  this.stop();
  return;
});

Meteor.publish('allUsersData', function(){
  return Meteor.users.find({},{
    fields: {
      '_id': 1,
      'profile.nombre': 1,
      'profile.name': 1,
      'services.facebook.id': 1
    }
  });
});

Meteor.publish('busquedas', function(userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    //Todas
    return Busquedas.find();
  }

  if (Roles.userIsInRole(userId, ['user'])){
    //Solo activa
    return Busquedas.find({active:true});
  }
  //console.log('User:Role:none');
  this.stop();
  return;
});

Meteor.publish('teams', function(busquedaId, userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    //Todas
    return Equipos.find();
  }

  if (Roles.userIsInRole(userId, ['user'])){
    //Solo activa
    return Equipos.find( {'busquedaId': busquedaId });
  }
  //console.log('User:Role:none');
  this.stop();
  return;
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
  //console.log('User:Role:none');
  this.stop();
  return;
});

Meteor.publish('roomsAndBuses', function(eventId, userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    return [
      Rooms.find(),
      Buses.find()
    ];
  }
  
  if (eventId){
    return [
      Rooms.find( {'eventId': eventId }),
      Buses.find( {'eventId': eventId })
    ];
  }

  this.stop();
  return;
});

//Config de Roles
//Roles.createRole('super-admin');
//Roles.createRole('admin');
//Roles.createRole('user');
//Roles.addUsersToRoles('h4FNibnjGG2heK3a6', 'super-admin'); //<<-- Poner ID del super admin