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
};

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
});

Accounts.onLogin(function(info) {
    var user = info.user;
    if(typeof user.profile !== 'undefined' && typeof user.id !== 'undefined') {
        var picture = getFbPicture(user.services.facebook.accessToken);
        if (user.profile.picture !== picture){
            Meteor.users.update({_id: user._id}, {$set: {'profile.picture': picture}});
        }
    }
});

Meteor.publish('userData', function(){
  return Meteor.users.find({_id:this.userId});
});

Meteor.publish('allUsersData', function(userId){
  if (Roles.userIsInRole(userId, ['super-admin', 'admin'])){
    //Con perfil completo
    return Meteor.users.find({},{
      fields: {
        '_id': 1,
        'profile': 1,
        'services.facebook.id': 1
      }
    });
  } else {
    return Meteor.users.find({},{
      fields: {
        '_id': 1,
        'profile.nombre': 1,
        'profile.name': 1,
        'services.facebook.id': 1
      }
    });
  }

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
