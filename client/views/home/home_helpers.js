if (Meteor.isClient) {

    Template.home.helpers({
        userLogged: function () {
            return Meteor.user();
        }
    });

    Template.homeLogged.helpers({
        greeting: function() {
            if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
                if (Meteor.user().services.facebook.gender == "male") {
                    return "Bienvenido "+Meteor.user().profile.name+"!";
                } else {
                    return "Bienvenida "+Meteor.user().profile.name+"!";
                }
            }
        },

        destination : function () {
          //Buscar si existe un evento "activo"
          var eName = Eventos.findOne({active:true}).name;
          return eName;
        },

        isEventSet : function () {
          //Buscar si existe un evento "activo"
          if(Session.get('event-active')){
            return true;
          } else {
            return false;
          }
        },

        isEventOpen : function () {
          //Opera sobre el evento open
          return Session.get('event-registracion');
        },

        isEventEnabled : function () {
          //Opera sobre el evento si esta enabled
          return Session.get('event-chismografo');
        },

        userAttendingEvent : function () {
          //Indica si el usuario logueado asistirá al evento
          return Session.get('event-attending');
        },

        isRoomSelected : function () {
          //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
          var results = Rooms.findOne({
            'pax': { $in: [Meteor.user()._id] },
            'eventId': Session.get('event-active')
          });

          if(results) {
            return true;
          }
          return false;
        },

        isBusSelected : function () {
          //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
          var results = Buses.findOne({
            'pax': { $in: [Meteor.user()._id] },
            'eventId': Session.get('event-active')
          });

          if(results) {
            return true;
          }
          return false;
        },

        isProfileComplete : function () {
          //Verificar que el usuario tenga sus campos obligatorios completos
          return Session.get('profile-complete');
        },

        picId : function () {
          if(Meteor.user() && Meteor.user().services && Meteor.user().services.facebook){
            return Meteor.user().services.facebook.id;
          }
      },

  });

}
