if (Meteor.isClient) {
    Template.homeViajes.helpers({
        isEventSet: function () {
            return Session.get('event-active');
        },

        userAttendingEvent: function () {
            //Indica si el usuario logueado asistirá al evento
            return _.indexOf(Meteor.user().eventos, this._id) >= 0;
        },

        totalPago: function () {
            return Meteor.user().pago;
        },

        seniaPaga: function () {
            return Meteor.user().sena;
        },

        isRoomSelected: function () {
            //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
            var results = Rooms.findOne({
                'pax': { $in: [Meteor.user()._id] },
                'eventId': this._id
            });

            if(results) {
                return true;
            }
            return false;
        },

        isBusSelected: function () {
            //Buscar si el usuario tiene una habitacion seleccionada en el evento activo
            var results = Buses.findOne({
                'pax': { $in: [Meteor.user()._id] },
                'eventId': this._id
            });

            if(results) {
                return true;
            }
            return false;
        },

        isProfileComplete: function () {
            return Session.get('profile-complete');
        },

        isAbleToChoose: function () {
            return Session.get('profile-complete') && Meteor.user().pago;
        }
    });
}
