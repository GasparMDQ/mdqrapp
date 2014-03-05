if (Meteor.isClient) {
  Template.eventEdit.rendered = function () {
    $('.make-switch').not('.has-switch').bootstrapSwitch();
    $('.loading-indicator').hide();

    //Hack de para manejar custom events
    $('.js-event-active-switch').on('switch-change', function(e, data) {
      if (data.value){
        var response = Meteor.call('setActiveEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('unSetActiveEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    });

    $('.js-event-register-switch').on('switch-change', function(e, data) {
      if (data.value){
        var response = Meteor.call('setRegisterEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('unSetRegisterEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    });

    $('.js-event-chismografo-switch').on('switch-change', function(e, data) {
      if (data.value){
        var response = Meteor.call('setChismeEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      } else {
        var response = Meteor.call('unSetChismeEvent', Session.get('edit-event'), Meteor.user(), function (error, result){
          if (error) { alert(error.message); }
        });
      }
    });
  };

  Template.eventRoomsList.hasRooms = function () {
    if(Session.get('edit-event')) {
      var roomsCount = Rooms.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}).count();
      return roomsCount>0;
    };
  };

  Template.eventRoomsList.rooms = function () {
    if(Session.get('edit-event')) { return Rooms.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}); };
  };

  Template.eventBusList.hasBuses = function () {
    if(Session.get('edit-event')) {
      var busesCount = Buses.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}).count();
      return busesCount>0;
    };
  };

  Template.eventBusList.buses = function () {
    if(Session.get('edit-event')) { return Buses.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}); };
  };

  Template.eventEdit.evento = function () {
    return Eventos.findOne({_id: Session.get('edit-event')});
  };

  Template.eventData.evento = function () {
    return Eventos.findOne({_id: Session.get('edit-event')});
  };

  Template.roomNew.events({
    'click .js-add-room' : function (e) {
      var updateBtn = $(e.target).closest('div.js-room').find('button.js-add-room').first();
      e.preventDefault();
      updateBtn.prop('disabled', true);
      var roomData = {
        id: $('#roomId').val(),
        descripcion: $('#roomDesc').val(),
        cupo: parseInt($('#roomQty').val()),
        eventId : Session.get('edit-event'),
        pax: []
      };
      var response = Meteor.call('roomAddNew', Session.get('edit-event'), Meteor.user(), roomData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        updateBtn.prop('disabled', false);
      });
      $('#roomId').val('');
      $('#roomDesc').val('');
      $('#roomQty').val('');
    },
  });

  Template.busNew.events({
    'click .js-add-bus' : function (e) {
      var updateBtn = $(e.target).closest('div.js-bus').find('button.js-add-bus').first();
      e.preventDefault();
      updateBtn.prop('disabled', true);
      var busData = {
        id: $('#busId').val(),
        descripcion: $('#busDesc').val(),
        cupo: parseInt($('#busQty').val()),
        eventId : Session.get('edit-event'),
        pax: []
      };
      var response = Meteor.call('busAddNew', Session.get('edit-event'), Meteor.user(), busData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        updateBtn.prop('disabled', false);
      });
      $('#busId').val('');
      $('#busDesc').val('');
      $('#busQty').val('');
    },
  });

  Template.eventEdit.events({
    'click .js-facebook-refresh-event' : function (e) {
      $('#event-refresh').show();
      e.preventDefault();
      var response = Meteor.call('refreshEventData', Session.get('edit-event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
        $('#event-refresh').hide();
      });

    },
  });

  Template.roomEdit.events({
    'click .js-remove-room' : function (e) {
      e.preventDefault();
      var response = Meteor.call('removeRoom', $(e.target).closest('div.js-room').data('room'), Session.get('edit-event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    },
    
    'click .js-update-room' : function (e) {
      e.preventDefault();
      var updateBtn = $(e.target).closest('div.js-room').find('button.js-update-room').first();
      var updateSpan = $(e.target).closest('div.js-room').find('span.glyphicon-save').first();

      var roomData = {
        _id: $(e.target).closest('div.js-room').data('room'),
        id: $(e.target).closest('div.js-room').find('input.js-room-id').val(),
        descripcion: $(e.target).closest('div.js-room').find('input.js-room-desc').val(),
        cupo: parseInt($(e.target).closest('div.js-room').find('input.js-room-qty').val()),
        eventId : Session.get('edit-event')
      };

      updateBtn.prop('disabled', true);
      var response = Meteor.call('updateRoom', $(e.target).closest('div.js-room').data('room'), Meteor.user(), roomData, function (error, result){
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

  Template.busEdit.events({
    'click .js-remove-bus' : function (e) {
      e.preventDefault();
      var response = Meteor.call('removeBus', $(e.target).closest('div.js-bus').data('bus'), Session.get('edit-event'), Meteor.user(), function (error, result){
        if (error) {
          alert(error.message);
        }
      });
    },
    
    'click .js-update-bus' : function (e) {
      e.preventDefault();
      var updateBtn = $(e.target).closest('div.js-bus').find('button.js-update-bus').first();
      var updateSpan = $(e.target).closest('div.js-bus').find('span.glyphicon-save').first();

      var busData = {
        _id: $(e.target).closest('div.js-bus').data('bus'),
        id: $(e.target).closest('div.js-bus').find('input.js-bus-id').val(),
        descripcion: $(e.target).closest('div.js-bus').find('input.js-bus-desc').val(),
        cupo: parseInt($(e.target).closest('div.js-bus').find('input.js-bus-qty').val()),
        eventId : Session.get('edit-event')
      };

      updateBtn.prop('disabled', true);
      var response = Meteor.call('updateBus', $(e.target).closest('div.js-bus').data('bus'), Meteor.user(), busData, function (error, result){
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
    setRegisterEvent: function(eId, user){
      if(eId){
        Eventos.update({ _id: eId.toString() }, { $set: { registracion: true }});
      }
    },

    unSetRegisterEvent: function(eId, user){
      if(eId){
        Eventos.update({ _id: eId.toString() }, { $set: { registracion: false }});
      }
    },
    setChismeEvent: function(eId, user){
      if(eId){
        Eventos.update({ _id: eId.toString() }, { $set: { chismografo: true }});
      }
    },

    unSetChismeEvent: function(eId, user){
      if(eId){
        Eventos.update({ _id: eId.toString() }, { $set: { chismografo: false }});
      }
    },

    roomAddNew: function(eId, user, roomData){
      if(eId && roomData){
        if(!roomData.id || roomData.id == ''){ return false; }
        if(!roomData.descripcion  || roomData.descripcion == '' ){ return false; }
        if(!roomData.cupo || roomData.cupo == '' ){ return false; }
        Rooms.insert(roomData);
      }
    },

    updateRoom: function(rId, user, roomData){
      if(rId && roomData){
        if(!roomData.id || roomData.id == ''){ return false; }
        if(!roomData.descripcion  || roomData.descripcion == '' ){ return false; }
        if(!roomData.cupo || roomData.cupo == '' ){ return false; }
        Rooms.update(
          { _id:roomData._id},
          { $set: {
            'id': roomData.id,
            'descripcion': roomData.descripcion,
            'cupo': roomData.cupo
          }}
        );
      }
    },

    removeRoom: function(rId, eId, user){
      if(rId){
        Rooms.remove({ _id: rId.toString() });
      }
    },

    busAddNew: function(eId, user, busData){
      if(eId && busData){
        if(!busData.id || busData.id == ''){ return false; }
        if(!busData.descripcion  || busData.descripcion == '' ){ return false; }
        if(!busData.cupo || busData.cupo == '' ){ return false; }
        Buses.insert(busData);
      }
    },

    updateBus: function(bId, user, busData){
      if(bId && busData){
        if(!busData.id || busData.id == ''){ return false; }
        if(!busData.descripcion  || busData.descripcion == '' ){ return false; }
        if(!busData.cupo || busData.cupo == '' ){ return false; }
        Buses.update({ _id:busData._id}, busData);
      }
    },

    removeBus: function(bId, eId, user){
      if(bId){
        Buses.remove({ _id: bId.toString() });
      }
    }

  });

}