if (Meteor.isClient) {
  Meteor.methods({

    unSetPagoTeam: function(tId, user){
      if(tId){
        Equipos.update(
          { _id:tId},
          { $set: { 'pago': false }}
        );
      }
    },

    setPagoTeam: function(tId, user){
      if(tId){
        Equipos.update(
          { _id:tId},
          { $set: { 'pago': true }}
        );
      }
    },
    
    updateTeam: function(tId, user, teamData){
      if(tId && teamData){
        if(!teamData.id || teamData.id == ''){ return false; }
        if(isNaN(teamData.handicap)){ return false; }
        if(isNaN(teamData.bonus)){ return false; }

        Equipos.update(
          { _id:teamData._id},
          { $set: {
            'id': teamData.id,
            'handicap': teamData.handicap,
            'route': teamData.route,
            'dnf': teamData.dnf,
            'bonus': teamData.bonus
          }}
        );
      }
    },

    teamCheckIn: function(tId, user){
      if(tId){
        var reservas = Equipos.find({'pax': user._id}).count();
        if (reservas == 0){
          Equipos.update( { '_id': tId }, { $addToSet: { 'pax': user._id } } );
        } else {
          var team = Equipos.findOne({'pax': user._id});
          alert('Ya se esta en el equipo ' + team.id);
        }
      }
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
          alert('Eres el dueño del equipo. Para salir del mismo debes borrarlo.');
        }
      }
    },

    addNewTeam: function(bId, user, tId){
      if(tId != ''){
        var existeTeam = Equipos.find({'id': tId}).count();

        var inTeam = Equipos.find({
          'busquedaId' : bId,
          'pax' : user._id
        }).count();

        if (inTeam == 0) {
          if(existeTeam == 0) {
            var teamData = {
              id: tId,
              pax: [user._id],
              dnf: false,
              routeId: '',
              respuestas: [],
              busquedaId: bId,
              handicap: 0,
              owner: user._id,
              pago: false,
              bonus: 0
            };
            Equipos.insert(teamData);
          } else {
            alert('Ya existe un equipo con el nombre ' + tId);
          }
        } else {
          alert('No podes crear un equipo porque ya estás en otro');
        };
      } else {
        alert('Debes ingresar un nombre para tu equipo');
      }
    },

    removeTeam: function(tId, user){
      if(tId){
        Equipos.remove({ _id: tId.toString() });
      }
    },

  });
};
