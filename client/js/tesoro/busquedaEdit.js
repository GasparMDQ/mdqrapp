if (Meteor.isClient) {
  Template.busquedaEdit.rendered = function () {
    $('.loading-indicator').hide();
  };

  Template.busquedaEdit.busqueda = function () {
    return Busquedas.findOne({_id: Session.get('edit-busqueda')});
  };  

  Template.busquedaData.busqueda = function () {
    return Busquedas.findOne({_id: Session.get('edit-busqueda')});
  };  

  Template.busquedaNodosList.hasNodos = function () {
    var nodosCount = Nodos.find({}, {sort: { 'id': 1}}).count();
    return nodosCount>0;
  };

  Template.busquedaNodosList.nodos = function () {
    return Nodos.find({}, {sort: { 'id': 1}});
  };

  Template.busquedaEquiposList.hasEquipos = function () {
    if(Session.get('edit-busqueda')) {
      var equiposCount = Equipos.find({'busquedaId': Session.get('edit-busqueda')}, {sort: { 'id': 1}}).count();
      return equiposCount>0;
    };
  };

  Template.busquedaEquiposList.equipos = function () {
    if(Session.get('edit-busqueda')) {
      return Equipos.find({'busquedaId': Session.get('edit-busqueda')}, {sort: { 'id': 1}});
    };
  };

  Template.busquedaRutasList.hasRoutes = function () {
    if(Session.get('edit-busqueda')) {
      var routesCount = Routes.find({'busquedaId': Session.get('edit-busqueda')}, {sort: { 'id': 1}}).count();
      return routesCount>0;
    };
  };

  Template.busquedaRutasList.routes = function () {
    if(Session.get('edit-busqueda')) {
      return Routes.find({'busquedaId': Session.get('edit-busqueda')}, {sort: { 'id': 1}});
    };
  };

  Template.nodoEdit.mapUrl = function () {
    var url="/nomap.gif";
    if(this.latitude && this.longitude) {
      url="http://maps.googleapis.com/maps/api/staticmap?size=300x300&zoom=17&markers=color:red%7C"+this.latitude+","+this.longitude+"&key=AIzaSyD65xdO0lXLeF2lzjuN0qBqc6RgjYgK6Pc&sensor=false";
    }
    return url;
  };

  Template.equipoShow.owner = function () {
    var ownerItem = Meteor.users.findOne({'_id': this.owner.toString()});
    if(ownerItem && ownerItem.profile) {
      return ownerItem.profile.name;
    }
    return 'no-data';
  };

  Template.paxTeam.user = function () {
    return Meteor.users.findOne({'_id': this.toString()});
  };

  Template.busquedaEdit.events({
    'click .js-event-active-toggle': function (e) {
      e.preventDefault();
      var data = $(e.currentTarget).data('toggle');
      if (data){
        var response = Meteor.call('unSetActiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('setActiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    },
    'click .js-event-live-toggle': function (e) {
      e.preventDefault();
      var data = $(e.currentTarget).data('toggle');
      if (data){
        var response = Meteor.call('unSetLiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('setLiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    },
  });

  Template.nodoNew.events({
    'click .js-add-nodo' : function (e) {
      var addBtn = $(e.target).closest('div.js-nodo').find('button.js-add-nodo').first();
      e.preventDefault();
      addBtn.prop('disabled', true);
      var nodoData = {
        id: $('#nodoId').val(),
        question: $('#nodoQuestion').val(),
        answer: parseInt($('#nodoAnswer').val()),
        lowOffset: parseInt($('#nodoLowOffset').val()),
        highOffset: parseInt($('#nodoHighOffset').val()),
        busquedaId : Session.get('edit-busqueda'),
        longitude : parseFloat($('#nodoLongitude').val()),
        latitude : parseFloat($('#nodoLatitude').val())
      };

      //En caso de no haber ingresado valores, el offset se setea en 0
      if(isNaN(nodoData.highOffset)) { nodoData.highOffset = 0 ;}
      if(isNaN(nodoData.lowOffset)) { nodoData.lowOffset = 0 ;}
      if(isNaN(nodoData.latitude)) { nodoData.latitude = "" ;}
      if(isNaN(nodoData.longitude)) { nodoData.longitude = "" ;}

      var response = Meteor.call('nodoAddNew', Session.get('edit-busqueda'), Meteor.user(), nodoData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        addBtn.prop('disabled', false);
      });
      $('#nodoId').val('');
      $('#nodoQuestion').val('');
      $('#nodoAnswer').val('');
      $('#nodoLowOffset').val('');
      $('#nodoHighOffset').val('');
      $('#nodoLongitude').val('');
      $('#nodoLatitude').val('');
    },
  });

  Template.routeNew.events({
    'click .js-add-route' : function (e) {
      var updateBtn = $(e.target).closest('div.js-route').find('button.js-add-route').first();
      e.preventDefault();
      updateBtn.prop('disabled', true);
      var routeData = {
        id: $('#routeId').val(),
        descripcion: $('#routeDesc').val(),
        cupo: parseInt($('#routeQty').val()),
        busquedaId : Session.get('edit-busqueda'),
        pax: []
      };
      var response = Meteor.call('routeAddNew', Session.get('edit-busqueda'), Meteor.user(), routeData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        updateBtn.prop('disabled', false);
      });
      $('#routeId').val('');
      $('#routeDesc').val('');
      $('#routeQty').val('');
    },
  });

  Template.nodoEdit.events({
    'click .js-remove-nodo' : function (e) {
      e.preventDefault();
      var confirmation = confirm('Desea eliminar esta pregunta?');
      if (confirmation == true ) {
        var response = Meteor.call('removeNodo', $(e.target).closest('div.js-nodo').data('nodo'), Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) {
            alert(error.message);
          }
        });
      }
    },
    
    'click .js-update-nodo' : function (e) {
      e.preventDefault();
      var updateBtn = $(e.target).closest('div.js-nodo').find('button.js-update-nodo').first();
      var updateSpan = $(e.target).closest('div.js-nodo').find('span.glyphicon-save').first();

      var nodoData = {
        _id: $(e.target).closest('div.js-nodo').data('nodo'),
        id: $(e.target).closest('div.js-nodo').find('input.js-nodo-id').val(),
        question: $(e.target).closest('div.js-nodo').find('textarea.js-nodo-question').val(),
        answer: parseInt($(e.target).closest('div.js-nodo').find('input.js-nodo-answer').val()),
        busquedaId : Session.get('edit-busqueda'),
        lowOffset: parseInt($(e.target).closest('div.js-nodo').find('input.js-nodo-lowOffset').val()),
        highOffset: parseInt($(e.target).closest('div.js-nodo').find('input.js-nodo-highOffset').val()),
        latitude: parseFloat($(e.target).closest('div.js-nodo').find('input.js-nodo-latitude').val()),
        longitude: parseFloat($(e.target).closest('div.js-nodo').find('input.js-nodo-longitude').val()),
      };

      //En caso de no haber ingresado valores, el offset se setea en 0
      if(isNaN(nodoData.highOffset)) { nodoData.highOffset = 0 ;}
      if(isNaN(nodoData.lowOffset)) { nodoData.lowOffset = 0 ;}
      if(isNaN(nodoData.latitude)) { nodoData.latitude = "" ;}
      if(isNaN(nodoData.longitude)) { nodoData.longitude = "" ;}

      updateBtn.prop('disabled', true);
      var response = Meteor.call('updateNodo', $(e.target).closest('div.js-nodo').data('nodo'), Meteor.user(), nodoData, function (error, result){
        if (error) {
          alert(error.message);
          updateBtn.prop('disabled', false);
        } else {
          updateSpan.toggleClass('glyphicon-saved');
          updateSpan.toggleClass('glyphicon-save');
          updateBtn.toggleClass('btn-warning');
          updateBtn.toggleClass('btn-success');

          //Modificaciones esteticas
          setTimeout(function(){
            updateBtn.toggleClass('btn-warning');
            updateBtn.toggleClass('btn-success');
            updateSpan.toggleClass('glyphicon-saved');
            updateSpan.toggleClass('glyphicon-save');
            updateBtn.prop('disabled', false);
            },
            3000
          );
        }
      });
    },
  });

  Template.routeEdit.events({
    'click .js-remove-route' : function (e) {
      e.preventDefault();
      var response = Meteor.call('removeRoute', $(e.target).closest('div.js-route').data('route'), Session.get('edit-busqueda'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    },
    
    'click .js-update-route' : function (e) {
      e.preventDefault();
      var updateBtn = $(e.target).closest('div.js-route').find('button.js-update-route').first();
      var updateSpan = $(e.target).closest('div.js-route').find('span.glyphicon-save').first();

      var routeData = {
        _id: $(e.target).closest('div.js-route').data('route'),
        id: $(e.target).closest('div.js-route').find('input.js-route-id').val(),
        descripcion: $(e.target).closest('div.js-route').find('input.js-route-desc').val(),
        cupo: parseInt($(e.target).closest('div.js-route').find('input.js-route-qty').val()),
        busquedaId : Session.get('edit-busqueda')
      };

      updateBtn.prop('disabled', true);
      var response = Meteor.call('updateRoute', $(e.target).closest('div.js-route').data('route'), Meteor.user(), routeData, function (error, result){
        if (error) {
          alert(error.message);
          updateBtn.prop('disabled', false);
        } else {
          updateSpan.toggleClass('glyphicon-saved');
          updateSpan.toggleClass('glyphicon-save');
          updateBtn.toggleClass('btn-warning');
          updateBtn.toggleClass('btn-success');

          //Modificaciones esteticas
          setTimeout(function(){
            updateBtn.toggleClass('btn-warning');
            updateBtn.toggleClass('btn-success');
            updateSpan.toggleClass('glyphicon-saved');
            updateSpan.toggleClass('glyphicon-save');
            updateBtn.prop('disabled', false);
            },
            3000
          );
        }
      });
    },

  });

  Template.equipoShow.events({
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

    'click .js-update-team' : function (e) {
      var updateBtn = $(e.target).closest('div.js-team').find('button.js-update-team').first();
      e.preventDefault();
      var teamData = {
        _id: $(e.target).closest('div.js-team').data('team'),
        id: $(e.target).closest('div.js-team').find('input.js-team-id').val(),
        handicap: parseInt($(e.target).closest('div.js-team').find('input.js-team-handicap').val()),
        bonus: parseInt($(e.target).closest('div.js-team').find('input.js-team-bonus').val()),
        route: $(e.target).closest('div.js-team').find('input.js-team-route').val(),
        dnf: $(e.target).closest('div.js-team').find('textarea.js-team-dnf').val(),
      };

      updateBtn.prop('disabled', true);
      var response = Meteor.call('updateTeam', $(e.target).closest('div.js-team').data('team'), Meteor.user(), teamData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
          alert('Los datos se grabaron correctamente');
        }
        updateBtn.prop('disabled', false);
      });
    },

    'click .js-team-pago-toggle': function (e) {
      e.preventDefault();
      var data = $(e.currentTarget).data('toggle');
      if (data){
        var response = Meteor.call('unSetPagoTeam', $(e.target).closest('div.js-team').data('team'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('setPagoTeam', $(e.target).closest('div.js-team').data('team'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    },

  });

  //Stubs
  Meteor.methods({
    nodoAddNew: function(nId, user, nodoData){
      if(nId && nodoData){
        if(!nodoData.id || nodoData.id == ''){ return false; }
        if(!nodoData.question  || nodoData.question == '' ){ return false; }
        if(isNaN(nodoData.answer)){ return false; }
        Nodos.insert(nodoData);
      }
    },

    updateNodo: function(nId, user, nodoData){
      if(nId && nodoData){
        if(!nodoData.id || nodoData.id == ''){ return false; }
        if(!nodoData.question  || nodoData.question == '' ){ return false; }
        if(isNaN(nodoData.answer)){ return false; }

        Nodos.update(
          { _id:nodoData._id},
          { $set: {
            'id': nodoData.id,
            'question': nodoData.question,
            'answer': nodoData.answer,
            'lowOffset': nodoData.lowOffset,
            'highOffset': nodoData.highOffset
          }}
        );
      }
    },

    removeNodo: function(nId, bId, user){
      if(nId){
        Nodos.remove({ _id: nId.toString() });
      }
    },

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

  });

}
