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

  Template.eventRoomsList.rooms = function () {
    if(Session.get('edit-event')) { return Rooms.find({'eventId': Session.get('edit-event')}, {sort: { 'id': 1}}); };
  };

  Template.eventEdit.evento = function () {
    return Eventos.findOne({_id: Session.get('edit-event')});
  };

  Template.eventData.evento = function () {
    return Eventos.findOne({_id: Session.get('edit-event')});
  };

  Template.eventData.formatDate = function (datetime, format) {
    if(datetime){
      var DateFormats = {
             short: "DD/MM/YYYY HH:mm",
             long: "dddd DD.MM.YYYY HH:mm"
      };

      if (moment) {
        f = DateFormats[format];
        return moment(datetime).format(f);
      }
      else {
        return datetime;
      }
    } else {
      return 'sin informacion';
    }
  };

  Template.roomNew.events({
    'click .js-add-room' : function (e) {
      e.preventDefault();
      $(e.target).prop('disabled', true);
      var roomData = {
        id: $('#roomId').val(),
        descripcion: $('#roomDesc').val(),
        cupo: $('#roomQty').val(),
        eventId : Session.get('edit-event')
      };
      var response = Meteor.call('roomAddNew', Session.get('edit-event'), Meteor.user(), roomData, function (error, result){
        if (error) {
          alert(error.message);
        } else {
        }
        $(e.target).prop('disabled', false);
      });
      $('#roomId').val('');
      $('#roomDesc').val('');
      $('#roomQty').val('');
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

    removeRoom: function(rId, eId, user){
      if(rId){
        Rooms.remove({ _id: rId.toString() });
      }
    }

  });

}