if (Meteor.isClient) {

    Template.homeViajes.events({
        "click .btn-asistir-evento": function(event, template){
            event.preventDefault();
            var data = {
                userId: Meteor.user()._id,
                eventId: this._id
            };
            var response = Meteor.call('userAddEvent',data, function (error, result){
                if (error) {
                    alert(error.message);
                }
            });

        },
        "click .btn-no-asistir-evento": function(event, template){
            event.preventDefault();
            if(confirm('Al bajarse del viaje, se libera el cupo\ny se borra su pago y lugares seleccionados.\nEsta seguro de continuar? ')){
                var data = {
                    userId: Meteor.user()._id,
                    eventId: this._id
                };
                var response = Meteor.call('userRemoveEvent',data, function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }

        }
    });

}
