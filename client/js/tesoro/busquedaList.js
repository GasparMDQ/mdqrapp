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
      var addBtn = $(e.target).closest('div.js-busqueda').find('button.js-add-busqueda').first();
      e.preventDefault();
      addBtn.prop('disabled', true);
      var busquedaData = {
        id: $('#busquedaId').val(),
        descripcion: $('#busquedaDesc').val(),
        begin: $('#busquedaBegin').val(),
        end: $('#busquedaEnd').val(),
        routes: [],
        active: false,
        live: false,
        cupoMax: parseInt($('#busquedaCupoMax').val()),
        cupoMin: parseInt($('#busquedaCupoMin').val()),
        facebookEvent: $('#busquedaFaceId').val(),
        publicScoreboard: false,
      };
      var response = Meteor.call('busquedaAddNew', Meteor.user(), busquedaData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
          $('#new-busqueda-form').collapse('hide');
        }
        addBtn.prop('disabled', false);
      });
      $('#busquedaId').val('');
      $('#busquedaDesc').val('');
      $('#busquedaBegin').val('');
      $('#busquedaEnd').val('');
      $('#busquedaCupoMax').val('');
      $('#busquedaCupoMin').val('');
      $('#busquedaFaceId').val('');
    },

  });

//Stubs
Meteor.methods({

});

}