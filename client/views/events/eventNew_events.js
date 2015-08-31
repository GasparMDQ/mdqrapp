if (Meteor.isClient){
    Template.eventNewForm.events({
      'click .js-add-event' : function (e) {
        e.preventDefault();
        var user = Meteor.user();
        var nuevoEvento = {};
        nuevoEvento.name = $('#nombreInput').val();
        nuevoEvento.shortDescripcion = $('#descripcionInput').val();
        nuevoEvento.description = $('#infoText').val();
        nuevoEvento.start_time = $('#fechaInputStart').val();
        nuevoEvento.end_time = $('#fechaInputEnd').val();
        nuevoEvento.costo = $('#costoInput').val();

        nuevoEvento.admins = {
            'data': [
            ]
        };
        nuevoEvento.owner = {
            name: user.services.facebook.name,
            id: user.services.facebook.id,
        };
        nuevoEvento.active = false;
        nuevoEvento.registracion = false;
        nuevoEvento.chismografo = false;

        nuevoEvento.chismes = [];
        nuevoEvento.habitaciones = [];
        nuevoEvento.micros = [];

        var response = Meteor.call('addNewEvent', nuevoEvento, Meteor.user(), function (error, result){
        if (error) {
            alert(error.reason+'\r\n'+error.details);
        } else {
            Router.go('editEvent', {_id: result});
        }
        });

      }
    });

}
