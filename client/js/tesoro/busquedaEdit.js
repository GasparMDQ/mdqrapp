if (Meteor.isClient) {
  Template.busquedaEdit.rendered = function () {
    $('.make-switch').not('.has-switch').bootstrapSwitch();
    $('.loading-indicator').hide();

    //Hack de para manejar custom events
    $('.js-event-active-switch').on('switch-change', function(e, data) {
      if (data.value){
        var response = Meteor.call('setActiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('unSetActiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    });
    $('.js-event-live-switch').on('switch-change', function(e, data) {
      if (data.value){
        var response = Meteor.call('setLiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('unSetLiveBusqueda', Session.get('edit-busqueda'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    });
  };

  Template.busquedaEdit.busqueda = function () {
    return Busquedas.findOne({_id: Session.get('edit-busqueda')});
  };  

  Template.busquedaData.busqueda = function () {
    return Busquedas.findOne({_id: Session.get('edit-busqueda')});
  };  

  Template.busquedaNodosList.hasNodos = function () {
    var nodosCount = Nodos.find({'busquedaId': Session.get('edit-busqueda')}, {sort: { 'id': 1}}).count();
    return nodosCount>0;
  };

  Template.busquedaNodosList.nodos = function () {
    return Nodos.find({}, {sort: { 'id': 1}});
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

  Template.nodoNew.events({
    'click .js-add-nodo' : function (e) {
      var updateBtn = $(e.target).closest('div.js-nodo').find('button.js-add-nodo').first();
      e.preventDefault();
      updateBtn.prop('disabled', true);
      var nodoData = {
        id: $('#nodoId').val(),
        question: $('#nodoQuestion').val(),
        answer: parseInt($('#nodoAnswer').val()),
        lowOffset: parseInt($('#nodoLowOffset').val()),
        highOffset: parseInt($('#nodoHighOffset').val()),
        busquedaId : Session.get('edit-busqueda'),
        pax: []
      };
      var response = Meteor.call('nodoAddNew', Session.get('edit-busqueda'), Meteor.user(), nodoData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        updateBtn.prop('disabled', false);
      });
      $('#nodoId').val('');
      $('#nodoQuestion').val('');
      $('#nodoAnswer').val('');
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
      var response = Meteor.call('removeNodo', $(e.target).closest('div.js-nodo').data('nodo'), Session.get('edit-busqueda'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    },
    
    'click .js-update-nodo' : function (e) {
      e.preventDefault();
      var updateBtn = $(e.target).closest('div.js-nodo').find('button.js-update-nodo').first();
      var updateSpan = $(e.target).closest('div.js-nodo').find('span.glyphicon-save').first();

      var nodoData = {
        _id: $(e.target).closest('div.js-nodo').data('nodo'),
        id: $(e.target).closest('div.js-nodo').find('input.js-nodo-id').val(),
        descripcion: $(e.target).closest('div.js-nodo').find('input.js-nodo-question').val(),
        cupo: parseInt($(e.target).closest('div.js-nodo').find('input.js-nodo-answer').val()),
        busquedaId : Session.get('edit-busqueda')
      };

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

  //Stubs
  Meteor.methods({
    nodoAddNew: function(bId, user, nodoData){
      if(bId && nodoData){
        if(!nodoData.id || nodoData.id == ''){ return false; }
        if(!nodoData.question  || nodoData.question == '' ){ return false; }
        if(!nodoData.answer || nodoData.answer == '' ){ return false; }
        Nodos.insert(nodoData);
      }
    },

    updateNodo: function(nId, user, nodoData){
      if(nId && nodoData){
        if(!nodoData.id || nodoData.id == ''){ return false; }
        if(!nodoData.question  || nodoData.question == '' ){ return false; }
        if(!nodoData.answer || nodoData.answer == '' ){ return false; }
        Nodos.update(
          { _id:nodoData._id},
          { $set: {
            'id': nodoData.id,
            'question': nodoData.question,
            'answer': nodoData.answer
          }}
        );
      }
    },

    removeNodo: function(nId, eId, user){
      if(nId){
        Nodos.remove({ _id: nId.toString() });
      }
    }
  });

}