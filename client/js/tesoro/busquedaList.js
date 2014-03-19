if (Meteor.isClient) {
  Template.busquedaTmpl.bId = function () {
    //Setting data context for links
    return {_id: this._id};
  };

  Template.busquedaAdminHome.userLogged = function () {
    return Meteor.user();
  };

  Template.busquedaAdminHome.hasBusquedas = function () {
    if (Roles.userIsInRole(Meteor.user(), ['super-admin', 'admin'])){
      var busquedasCount = Busquedas.find({}, {sort: { 'id': 1}}).count();
      return busquedasCount>0;
    }      
  };

  Template.busquedaAdminHome.busqueda = function () {
    if (Roles.userIsInRole(Meteor.user(), ['super-admin', 'admin'])){
      return Busquedas.find({}, {sort: { 'id': 1}});
    }      
  };

  Template.busquedaAdminHome.events({
    'click .js-set-active' : function (e) {
      e.preventDefault();
      var response = Meteor.call('setActiveBusqueda', $(e.target).closest('div.js-busqueda').data('busqueda'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    },

    'click .js-busqueda-remove' : function (e) {
      e.preventDefault();
      var confirmation = confirm('Desea eliminar esta búsqueda?');
      if (confirmation == true ) {
        var response = Meteor.call('removeBusqueda', $(e.target).closest('div.js-busqueda').data('busqueda'), Meteor.user(), function (error, result){
          if (error) {
            alert(error.message);
          }
        });
      }

    },

    'click .js-set-deactive' : function (e) {
      e.preventDefault();
      var response = Meteor.call('unSetActiveBusqueda', $(e.target).closest('div.js-busqueda').data('busqueda'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });

    },

    'click .js-add-busqueda' : function (e) {
      var updateBtn = $(e.target).closest('div.js-busqueda').find('button.js-add-busqueda').first();
      e.preventDefault();
      updateBtn.prop('disabled', true);
      var busquedaData = {
        id: $('#busquedaId').val(),
        descripcion: $('#busquedaDesc').val(),
        date: $('#busquedaDate').val(),
        routes: [],
        active: false,
        live: false
      };
      var response = Meteor.call('busquedaAddNew', Meteor.user(), busquedaData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        updateBtn.prop('disabled', false);
      });
      $('#busquedaId').val('');
      $('#busquedaDesc').val('');
      $('#busquedaDate').val('');
    },

  });

//Stubs
Meteor.methods({
  setActiveBusqueda: function(bId, user){
    if(bId){
      Busquedas.update({ _id: { $ne: bId.toString() }}, { $set: { active: false }}, {multi: true});
      Busquedas.update({ _id: bId.toString() }, { $set: { active: true }});
    }
  },

  unSetActiveBusqueda: function(bId, user){
    if(bId){
      Busquedas.update({ _id: bId.toString() }, { $set: { active: false }});
    }
  },

  removeBusqueda: function(bId, user){
    if(bId){
      Busquedas.remove({ _id: bId.toString() });
    }
  },

  busquedaAddNew: function(user, busquedaData){
    if(busquedaData){
      if(!busquedaData.id || busquedaData.id == ''){ return false; }
      if(!busquedaData.descripcion  || busquedaData.descripcion == '' ){ return false; }
      if(!busquedaData.date || busquedaData.date == '' ){ return false; }
      Busquedas.insert(busquedaData);
    }
  },


});

}