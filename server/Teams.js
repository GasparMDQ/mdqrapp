var Trunc = function(string, n, useWordBoundary){
  var toLong = string.length>n,
  s_ = toLong ? string.substr(0,n-1) : string;
  s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
  return  toLong ? s_ + ' ...' : s_;
};

Meteor.methods({

  isTeamValid: function(teamData){
    if(teamData) {
      if(!teamData.id || teamData.id == ''){ return false; }
      //Verifico que no exista otro equipo con el mismo nombre
      var existeTeam = Equipos.find({'id': teamData.id}).count();
      if(existeTeam != 0) { return false; }
      return true;
    }
    return false;
  },

  addNewTeam: function(bId, user, tId){
    var teamData = {
      id: tId,
      pax: [user._id],
      dnf: false,
      routeId: '',
      respuestas: [],
      busquedaId: bId,
      handicap: 0,
      owner: user._id,
      pago: false
    };

    Meteor.call('isTeamValid',teamData, function (error, result){
      if (result) {
        Meteor.call('userInTeam', bId, user._id, function (error, result){
          if(typeof result != 'undefined' && !result){
            Equipos.insert(teamData);
          } else {
            console.log('Error:addNewTeam:userInTeam: '+ error);
          }
        });
      } else {
        console.log('Error:addNewTeam:isTeamValid: not valid');
      }
    });
  },

  removeTeam: function(tId, user){
    if(tId) {
      var isOwner = Equipos.find({
        '_id' : tId,
        'owner' : user._id
      }).count() != 0;

      if (isOwner || Roles.userIsInRole(user, ['admin','super-admin'])) {
        Equipos.remove({ _id: tId.toString() });
      } else {
        console.log('Error:removeTeam: not allowed');
      }
    }
  },

  updateTeam: function(tId, user){
  },

  teamCheckIn: function(tId, user){
    //Veririco que se hayan pasado todos los parametros
    if(tId && user){
      var team = Equipos.findOne( { '_id': tId } );

      Meteor.call('userInTeam', team.busquedaId, user._id, function (error, result){
        if(typeof result != 'undefined' && !result){
          //Verifico el equipo tenga cupo disponible
          Meteor.call('teamIsAvailable',tId, function (error, result){
            if(result){
              Equipos.update( { '_id': tId }, { $addToSet: { 'pax': user._id } } );
            } else {
              console.log('Error:teamCheckIn:teamIsAvailable: '+ error);
            }
          });
        } else {
          console.log('Error:teamCheckIn:userInTeam: '+ error);
        }

      });

    } else {
      console.log('Error:teamCheckIn: faltan parametros');
    }


  },

  teamIsAvailable: function(tId){
    var team = Equipos.findOne( { '_id': tId } );
    var busqueda = Busquedas.findOne( {'_id': team.busquedaId} );
    return busqueda.cupoMax - team.pax.length > 0;
  },

  userInTeam: function(bId, userId){
    var inTeam = Equipos.find({
      'busquedaId' : bId,
      'pax' : userId
    }).count();

    if (inTeam == 0) { return false; } else { return true; };
  },

  teamCheckOut: function(tId, userId){
    if(tId && Meteor.user()._id == userId){
      var isOwner = Equipos.find({
        '_id' : tId,
        'owner' : userId
      }).count();

      if (isOwner == 0) {
        Equipos.update( { '_id': tId }, { $pull: { 'pax': Meteor.user()._id } } );
      } else {
        console.log('Error:teamCheckOut: user is owner');
      }
    }
  },

  unSetPagoTeam: function(tId, user){
    if(tId || Roles.userIsInRole(user, ['admin','super-admin'])){
      Equipos.update(
        { _id:tId},
        { $set: { 'pago': false }}
      );
    }
  },

  setPagoTeam: function(tId, user){
    if(tId || Roles.userIsInRole(user, ['admin','super-admin'])){
      Equipos.update(
        { _id:tId},
        { $set: { 'pago': true }}
      );
    }
  },

});
