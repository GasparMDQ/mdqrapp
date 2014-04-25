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

  Template.busquedaEquiposList.equiposCount = function () {
    if(Session.get('edit-busqueda')) {
      return Equipos.find({'busquedaId': Session.get('edit-busqueda')}, {sort: { 'id': 1}}).count();
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

  Template.busquedaEdit.mapInitUrl = function () {
    var url="/nomap.gif";
    if(Session.get('edit-busqueda')) {
      var busqueda = Busquedas.findOne({_id: Session.get('edit-busqueda')});
      if(typeof busqueda != 'undefined' && busqueda.initLatitude && busqueda.initLongitude) {
        url="http://maps.googleapis.com/maps/api/staticmap?size=300x300&zoom=17&markers=color:red%7C"+busqueda.initLatitude+","+busqueda.initLongitude+"&key=AIzaSyD65xdO0lXLeF2lzjuN0qBqc6RgjYgK6Pc&sensor=false";
      }
    }
    return url;
  };

  Template.busquedaEdit.mapEndUrl = function () {
    var url="/nomap.gif";
    if(Session.get('edit-busqueda')) {
      var busqueda = Busquedas.findOne({_id: Session.get('edit-busqueda')});
      if(typeof busqueda != 'undefined' && busqueda.endLatitude && busqueda.endLongitude) {
        url="http://maps.googleapis.com/maps/api/staticmap?size=300x300&zoom=17&markers=color:red%7C"+busqueda.endLatitude+","+busqueda.endLongitude+"&key=AIzaSyD65xdO0lXLeF2lzjuN0qBqc6RgjYgK6Pc&sensor=false";
      }
    }
    return url;
  };

  Template.nodoRouteShow.nodo = function () {
    return Nodos.findOne({_id: this.valueOf() });
  };  

  Template.nodoRouteShow.isFirst = function (data) {
    return data.nodos.indexOf(this.valueOf()) == 0;
  };  

  Template.nodoRouteShow.isLast = function (data) {
    return data.nodos.indexOf(this.valueOf()) == data.nodos.length-1;
  };  

  Template.nodoRouteShow.indexOfNodo = function (data) {
    return data.nodos.indexOf(this.valueOf());
  };

  Template.routeEdit.nodosNoUsados = function (data) {
    return Nodos.find({_id: {$nin: data}},{sort: { 'id': 1}});
  };

  Template.routeEdit.distancia = function () {
    var distancia = 0;

    if(Session.get('edit-busqueda')) {
      var currentNode, lastNode;
      var busqueda = Busquedas.findOne({_id: Session.get('edit-busqueda')});
      if(
          typeof busqueda != 'undefined' &&
          busqueda.initLatitude &&
          busqueda.initLongitude &&
          busqueda.endLatitude &&
          busqueda.endLongitude
        ) {

          if(this.nodos.length == 0){
            distancia = distanceBetweenNodes(
              {'latitude':busqueda.initLatitude, 'longitude': busqueda.initLongitude },
              {'latitude':busqueda.endLatitude, 'longitude': busqueda.endLongitude }
            );
          } else {
            lastNode = {'latitude':busqueda.initLatitude, 'longitude': busqueda.initLongitude };
            for (var i=0;i<this.nodos.length;i++) {
              currentNode = Nodos.findOne({_id: this.nodos[i]});
              if(currentNode.latitude!=0 && currentNode.longitude !=0){
                distancia += distanceBetweenNodes(currentNode, lastNode);
                lastNode = currentNode;
              }
            }
            distancia += distanceBetweenNodes(lastNode, {'latitude':busqueda.endLatitude, 'longitude': busqueda.endLongitude });
          }
      }
    }

    return distancia.toFixed(2);
  };

  Template.equipoShow.owner = function () {
    var ownerItem = Meteor.users.findOne({'_id': this.owner.toString()});
    if(ownerItem && ownerItem.profile) {
      return ownerItem.profile.name;
    }
    return 'no-data';
  };

  Template.equipoShow.ruta = function (data) {
    if(data){
      return Routes.findOne({'_id': data}).id;
    }
    return 'sin asignar';
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

    'click .js-event-scoreBoard-toggle': function (e) {
      e.preventDefault();
      var data = $(e.currentTarget).data('toggle');
      if (data){
        var response = Meteor.call('setScoreBoardBusqueda', Session.get('edit-busqueda'), Meteor.user(), !data, function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('setScoreBoardBusqueda', Session.get('edit-busqueda'), Meteor.user(), !data, function (error, result){
          if (error) { alert(error.message); }
        });
      }
    },

    'click .js-update-busqueda-inicio' : function (e) {
      e.preventDefault();
      var updateData = {
        latitude: parseFloat($(e.target).closest('.js-busqueda-inicio').find('input.js-busqueda-inicio-latitud').val()),
        longitude: parseFloat($(e.target).closest('.js-busqueda-inicio').find('input.js-busqueda-inicio-longitud').val()),
      };

      var response = Meteor.call('updateBusquedaLocInit', Session.get('edit-busqueda'), Meteor.user(), updateData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
          alert('Los datos se grabaron correctamente');
        }
      });
    },

    'click .js-update-busqueda-final' : function (e) {
      e.preventDefault();
      var updateData = {
        latitude: parseFloat($(e.target).closest('.js-busqueda-final').find('input.js-busqueda-final-latitud').val()),
        longitude: parseFloat($(e.target).closest('.js-busqueda-final').find('input.js-busqueda-final-longitud').val()),
      };

      var response = Meteor.call('updateBusquedaLocEnd', Session.get('edit-busqueda'), Meteor.user(), updateData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
          alert('Los datos se grabaron correctamente');
        }
      });
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
        latitude : parseFloat($('#nodoLatitude').val()),
        zona: $('#nodoZona').val(),
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
      $('#nodoZona').val('');
    },
  });

  Template.routeNew.events({
    'click .js-add-route' : function (e) {
      var addBtn = $(e.target).closest('div.js-route').find('button.js-add-route').first();
      e.preventDefault();
      addBtn.prop('disabled', true);
      var routeData = {
        id: $('#routeId').val(),
        busquedaId : Session.get('edit-busqueda'),
        nodos: []
      };
      var response = Meteor.call('routeAddNew', Session.get('edit-busqueda'), Meteor.user(), routeData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        addBtn.prop('disabled', false);
      });
      $('#routeId').val('');
    },
  });

  Template.nodoEdit.events({
    'click .js-remove-nodo' : function (e) {
      e.preventDefault();
      var nodeId = $(e.target).closest('div.js-nodo').data('nodo');
      var nodo = Nodos.findOne({_id: nodeId});

      var confirmation = confirm('Desea eliminar la pregunta "'+nodo.id+'"?');
      if (confirmation == true ) {
        var response = Meteor.call('removeNodo', nodeId, Session.get('edit-busqueda'), Meteor.user(), function (error, result){
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
        zona: $(e.target).closest('div.js-nodo').find('input.js-nodo-zona').val(),
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
      var routeId = $(e.target).closest('div.js-route').data('route');
      var route = Routes.findOne({_id: routeId});

      var confirmation = confirm('Desea eliminar la ruta "'+route.id+'"?');
      if (confirmation == true ) {
        var response = Meteor.call('removeRoute', routeId, Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) {
            alert(error.message);
          }
        });
      }
    },
    
    'click .js-update-route' : function (e) {
      e.preventDefault();
      var updateBtn = $(e.target).closest('div.js-route').find('button.js-update-route').first();
      var updateSpan = $(e.target).closest('div.js-route').find('span.glyphicon-save').first();

      var routeData = {
        _id: $(e.target).closest('div.js-route').data('route'),
        id: $(e.target).closest('div.js-route').find('input.js-route-id').val(),
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

    'click .js-add-node': function (e){
      e.preventDefault();
      var routeId = $(e.target).closest('div.js-route').data('route');
      var nodeId = $(e.currentTarget).closest('div.js-new-node-route').find(':selected').data("id");
      var route = Routes.findOne({_id: routeId});
      
      route.nodos.push(nodeId);
      
      var response = Meteor.call('routeNodeSave', routeId, Meteor.user(), route.nodos, function (error, result){
        if (error) { alert(error.message); }
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

  Template.nodoRouteShow.events({
    'click .js-move-node-up': function (e){
      e.preventDefault();
      var routeId = $(e.target).closest('div.js-route').data('route');
      var nodeId = $(e.target).closest('div.js-route-node').data('nodo');
      var route = Routes.findOne({_id: routeId});
      var nodeIdx = route.nodos.indexOf(nodeId);

      //Disable UP buttons
      route.nodos.splice(nodeIdx,1);
      route.nodos.splice(nodeIdx-1,0,nodeId);

      var response = Meteor.call('routeNodeSave', routeId, Meteor.user(), route.nodos, function (error, result){
        if (error) { alert(error.message); }
      });
    },
    
    'click .js-move-node-down': function (e){
      e.preventDefault();
      var routeId = $(e.target).closest('div.js-route').data('route');
      var nodeId = $(e.target).closest('div.js-route-node').data('nodo');
      var route = Routes.findOne({_id: routeId});
      var nodeIdx = route.nodos.indexOf(nodeId);

      route.nodos.splice(nodeIdx,1);
      route.nodos.splice(nodeIdx+1,0,nodeId);

      var response = Meteor.call('routeNodeSave', routeId, Meteor.user(), route.nodos, function (error, result){
        if (error) { alert(error.message); }
      });
    },
    
    'click .js-remove-node': function (e){
      e.preventDefault();
      var routeId = $(e.target).closest('div.js-route').data('route');
      var nodeId = $(e.target).closest('div.js-route-node').data('nodo');
      var route = Routes.findOne({_id: routeId});
      var nodeIdx = route.nodos.indexOf(nodeId);

      route.nodos.splice(nodeIdx,1);

      var response = Meteor.call('routeNodeSave', routeId, Meteor.user(), route.nodos, function (error, result){
        if (error) { alert(error.message); }
      });
    },

  });  

  //Stubs
  Meteor.methods({

  });

}
