if (Meteor.isClient) {

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


    Template.roomEdit.events({
        'click .js-remove-room' : function (e) {
            e.preventDefault();
            var confirmation = confirm('Desea eliminar esta habitación?');
            if (confirmation === true ) {
                var response = Meteor.call('removeRoom', $(e.target).closest('div.js-room').data('room'), Session.get('edit-event'), Meteor.user(), function (error, result){
                    if (error) {
                        alert(error.message);
                    }
                });
            }
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

}
