if (Meteor.isClient) {

  Template.teamList.hasEquipos = function () {
    if(Session.get('busqueda-active')) {
      var equiposCount = Equipos.find({'busquedaId': Session.get('busqueda-active')}, {sort: { 'id': 1}}).count();
      return equiposCount>0;
    };
  };

  Template.teamList.equipos = function () {
    if(Session.get('busqueda-active')) {
      return Equipos.find({'busquedaId': Session.get('busqueda-active')}, {sort: { 'id': 1}});
    };
  };

  Template.teamDetail.canJoin = function () {
    //El equipo debe tener cupo
    if(Session.get('busqueda').cupoMax - this.pax.length <= 0) { return false; };
    //La persona no debe estar en otro equipo
    var isMember = Equipos.find({
      'busquedaId' : Session.get('busqueda-active'),
      'pax' : Meteor.user()._id
    }).count();
    if (isMember != 0) { return false; };

    return true;
  };

  Template.teamDetail.isOwner = function () {
    return this.owner == Meteor.user()._id;
  };

  Template.newTeam.cupoMinimo = function () {
    return Session.get('busqueda').cupoMin;
  };

  Template.teamDetail.lugaresDisponibles = function () {
    return Session.get('busqueda').cupoMax - this.pax.length;
  };

  Template.paxTeamDetail.user = function () {
    return Meteor.users.findOne({'_id': this.toString()});
  };

  Template.teamDetail.events({
    'click .js-check-in' : function (e) {
      e.preventDefault();
      var response = Meteor.call('teamCheckIn', $(e.target).closest('div.js-team').data('team'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    },

    'click .js-team-remove' : function (e) {
      e.preventDefault();
      var confirmation = confirm('Esta seguro que desea eliminar este equipo?');
      if (confirmation == true ) {
        var response = Meteor.call('removeTeam', $(e.target).closest('div.js-team').data('team'), Meteor.user(), function (error, result){
          if (error) {
            alert(error.message);
          }
        });
      }
    },
    

  });
  Template.paxTeamDetail.events({
    'click .js-check-out' : function (e) {
      e.preventDefault();
      var response = Meteor.call('teamCheckOut', $(e.target).closest('div.js-team').data('team'), $(e.target).data('profile'), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    }
  });

  Template.newTeam.events({
    'click .js-add-team' : function (e) {
      var addBtn = $(e.target).closest('div.js-team').find('button.js-add-team').first();
      e.preventDefault();
      addBtn.prop('disabled', true);
      var response = Meteor.call('addNewTeam', Session.get('busqueda-active'), Meteor.user(), $('#teamId').val(), function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        addBtn.prop('disabled', false);
      });
      $('#teamId').val('');
      $('#new-team-form').collapse('hide');
    },
  });


//Stubs
Meteor.methods({
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
            owner: user._id
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
      Rooms.remove({ _id: tId.toString() });
    }
  },

});

}