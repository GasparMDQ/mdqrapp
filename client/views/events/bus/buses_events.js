if (Meteor.isClient) {

    Template.busNew.events({
        'click .js-add-bus' : function (e) {
            var updateBtn = $(e.target).closest('div.js-bus').find('button.js-add-bus').first();
            e.preventDefault();
            updateBtn.prop('disabled', true);
            var busData = {
                id: $('#busId').val(),
                descripcion: $('#busDesc').val(),
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
        },
    });


    Template.busEdit.events({
        'click .js-remove-bus' : function (e) {
            e.preventDefault();
            var confirmation = confirm('Desea eliminar este micro?');
            if (confirmation === true ) {
                var response = Meteor.call('removeBus', $(e.target).closest('div.js-bus').data('bus'), Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }
        },

        'click .js-add-row-bus' : function (e) {
            e.preventDefault();
            console.log(this);
            var response = Meteor.call('addRowToBus', this._id, Session.get('edit-event'), Meteor.user(), function (error, result){
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

}
